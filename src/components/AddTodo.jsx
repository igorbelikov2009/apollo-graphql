import { useState } from "react";
import { Button, FormControl, Input } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { ADD_TODO, ALL_TODO } from "../apollo/todos";

const AddTodo = () => {
  const [text, setText] = useState("");

  // useMutation() подразумевает, что мутацию мы хотим запустить по определённому
  // событию: кнопочку нажать, или клавишу "Enter" внутри формы.
  // 1-м параметром принимает функцию AddTodo, 2-м параметром принимает объект
  // { data, loading, error }, созданный хуком useQuery() на странице TodoList.jsx,
  // выбираем из него то, что нам здесь на странице нужно.
  const [AddTodo, { error }] = useMutation(ADD_TODO, {
    // // Для принудительной перезагрузки после добавления todo, для обновления загрузки всех todo.
    // // Без этого параметра новая todo не добавиться, автоматически, в список, придётся
    // // делать перезагрузку в ручную. Мы говорим: "Вот тебе квери, обнови их все."
    // refetchQueries: [{ query: ALL_TODO }],
    //=============================================================================
    // Другой вариант update() используем тогда, когда нам не нужен весь список todo.
    // update предполагает, что мы сами, вручную обновляем кэш. То что мы печатается в нашем
    // приложении, это данные из кэша. Кэш пополняется запросами, приложение не знает, когда
    // именно нужно делать запрос на обновление кэша. Мы можем обновлять кэш самостоятельно.
    // Нам это нужно, когда мы добаляем, удаляем, изменяем данные.
    // newTodo ?  Смотри страницу todos.js, строку 15
    update(cache, { data: { newTodo } }) {
      // Обращаемся к кэшу, используем его метод чтения: "Прочитай нам все значения,
      // которые лежат в query: ALL_TODO". Деструктуризацией достаём эти тудушки.
      const { todos } = cache.readQuery({ query: ALL_TODO });
      // А теперь обновляем кэш: "Запиши новое значение в кэш"
      cache.writeQuery({
        query: ALL_TODO,
        data: {
          // Добавляем новую тудушку, которую мы взяли из параметров. А потом сделаем
          // спред оператором извлечение всех тудушек, которые были до этого. Тем самым
          // обновляется кэш, и не надо делать новый запрос и не нужен refetchQueries
          todos: [newTodo, ...todos],
        },
      });
    },
  });

  const handleAddTodo = () => {
    // нажатие на кнопку
    if (text.trim().length) {
      AddTodo({
        variables: {
          title: text,
          completed: false,
          userId: 123,
        },
      });
      setText("");
    }
  };

  const handleKey = (event) => {
    // нажатие клавиши "Enter" внутри формы
    if (event.key === "Enter") handleAddTodo();
  };

  if (error) return <h1>Error... </h1>;

  return (
    <FormControl display={"flex"} mt={6}>
      <Input value={text} onChange={(e) => setText(e.target.value)} onKeyPress={handleKey} />
      <Button onClick={handleAddTodo}>Add todo</Button>
    </FormControl>
  );
};

export default AddTodo;
// Мы создали query через gql на странице todos.js, мы его импортировали сюда, передали в
// хук useMutation(). Этот хук вернул нам массив с функцией AddTodo, которую мы потом вызывали.
// В функцию передали значения переменных, то что нам динамически нужно отправитьна сервер,
// и, если мы хотим в ручную обновлять кэш, или делать рефечинг, мы параметром в мутацию
// передаём второй параметр опциями.
