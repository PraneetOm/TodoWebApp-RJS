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
      <h1 className="app-title">📝 Todo Web App</h1>
      <p className="tagline">Your simple daily task manager</p>

      <TodoInputs todoVal={todoVal} setTodoVal={setTodoVal} handleTodos={addNewTodo} />
      <TodoList editTodo={editTodo} todos={todos} deleteTodo={deleteTodo} /> 
      <div className="creator-badge">
        <p>
          Created by <strong>Praneet Om</strong><br />
          <a href="https://github.com/PraneetOm/TodoWebApp-RJS" target="_blank" rel="noreferrer">
            Source Code
          </a> | 
          <a href="https://github.com/PraneetOm" target="_blank" rel="noreferrer">GitHub</a> | 
          <a href="https://linkedin.com/in/praneet-om" target="_blank" rel="noreferrer">LinkedIn</a>
        </p>
      </div>

    </main>
  )
}

export default App