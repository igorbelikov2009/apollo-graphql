import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";

function App() {
  return (
    <div className="App">
      <AddTodo />
      <TodoList />
    </div>
  );
}

export default App;
// Для работы использовали  "@apollo/client": "^3.7.3", и  "graphql": "^16.6.0", .
// В качестве сервера мы использовали "json-graphql-server": "^2.3.2", .
// Файл db.js мы создали и использовалив качестве базы данных сервера.
// Для работы, первым делом мы создали client в файле client.js в папке apollo,
// Наше приложения мы оборачиваем в ApolloProvider на странице index.js.
// После этого нам доступны все хуки, которые есть в apollo-client.
//
