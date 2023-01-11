import { VStack } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import { useQuery, useMutation } from "@apollo/client";

import TodoItem from "./TodoItem";
import TotalCount from "./TotalCount";
import { ALL_TODO, UPDATE_TODO, DELETE_TODO } from "../apollo/todos";

const TodoList = () => {
  // useQuery подразумевает запрос сразу, запрос произойдёт автоматически,
  // нам не надо писать useEffect(), ничего.
  const { data, loading, error } = useQuery(ALL_TODO);

  // Так как, это мутация, элементы которой уже существуют у нас в кэше,
  // дополнительно преобразовывать ничего не нужно, кэш обновится автоматически.
  // toggleTodo будем передавать вниз, в <TodoItem />
  const [toggleTodo, { error: updateError }] = useMutation(UPDATE_TODO);
  // removeTodo будем передавать вниз, в <TodoItem />
  const [removeTodo, { error: deleteError }] = useMutation(DELETE_TODO, {
    // Снова используем метод  update(),
    update(cache, { data: { removeTodo } }) {
      // У кэша используем метод: модификация. Для модификации мы говорим, что мы хотим
      // поменять конкретные поля, и эти поля называются allTodos. Аллиас мы не можем
      // использовать, только оригинал со страницы todos.js, строка 5.
      cache.modify({
        fields: {
          // allTodos принимает параметрами текущие тудушки, если их нет то пустой массив.
          allTodos(currentTodos = []) {
            // дальше мы должны отфильтровать наш currentTodos с этим id-шником.
            // смотрим в кэш, там тудушки хранятся рефами, поэтому нам надо вернуть
            // наши тудушки, но отфильтрованные.
            // __ref:"Todo:2" так выглядит наша тудушка в кэше, смотри devtools apollo, cache.
            // Выражение ${removeTodo.id} - это наш id.
            return currentTodos.filter((todo) => todo.__ref !== `Todo:${removeTodo.id}`);
          },
        },
      });
    },
  });

  if (loading) {
    return <Spinner />;
  }

  if (error || updateError || deleteError) return <h2>Error!!!</h2>;

  return (
    <>
      <VStack spacing={2} mt={4}>
        {data.todos.map((todo) => (
          <TodoItem key={todo.id} onToggle={toggleTodo} {...todo} onDelete={removeTodo} />
        ))}
      </VStack>
      <TotalCount />
    </>
  );
};

export default TodoList;
