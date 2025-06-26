import TodoList from "./TodoList"
import TodoInputs from "./TodoInputs"
import { useState, useEffect } from "react"

function App() {

  const [todos, setTodos] = useState([]);

  const [todoVal, setTodoVal] = useState('');

  function persistData(newData) {
    localStorage.setItem('todos', JSON.stringify({ todos: newData }));
  }
  
  function addNewTodo(newTodo) {
    const newList = [...todos, newTodo];
    persistData(newList)
    setTodos(newList);
  }

  function deleteTodo(index) {
    const newTodoList = todos.filter((todos, todoIdx) => {
      return todoIdx != index;
    })
    persistData(newTodoList)
    setTodos(newTodoList);
  }

  function editTodo(index) {
    const valueToBeEdited = todos[index];
    setTodoVal(valueToBeEdited);
    deleteTodo(index);
  }

  useEffect(() => {
    if (!localStorage) return;
    
    let localTodos = localStorage.getItem('todos');
    
    if (!localTodos) return;

    localTodos = JSON.parse(localTodos).todos;

    setTodos(localTodos);

  }, [])

  return (
    <main>
      <TodoInputs todoVal={todoVal} setTodoVal={setTodoVal} handleTodos={addNewTodo} />
      <TodoList editTodo={editTodo} todos={todos} deleteTodo={deleteTodo} /> 
    </main>
  )
}

export default App