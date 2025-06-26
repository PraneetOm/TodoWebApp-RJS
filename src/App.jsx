import TodoList from "./TodoList"
import TodoInputs from "./TodoInputs"
import CompletedTodos from "./CompletedTodos";
import { useState, useEffect } from "react"

function App() {

  // Datas

  const [todos, setTodos] = useState([]);
  const [doneTodos, setdoneTodos] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [todoVal, setTodoVal] = useState('');
  // ---

  // Data Saving & Persistance

  function persistTodo(newData) {
    localStorage.setItem('todos', JSON.stringify({ todos: newData }));
  }

  function persistFinishedTodo(newData) {
    localStorage.setItem('finishedtodos', JSON.stringify({ todos: newData }));
  }
  // ---

  // undo
  function handleUndo() {
    if (undoStack.length === 0) return;
    
    const prevState = undoStack[undoStack.length - 1];
    if (!prevState || !prevState.todos || !prevState.doneTodos) return;

    setUndoStack(prev => prev.slice(0, prev.length - 1));
    
    setRedoStack(prev => [...prev, { todos, doneTodos }]);
    
    setTodos(prevState.todos);
    setdoneTodos(prevState.doneTodos);
    
    persistTodo(prevState.todos);
    persistFinishedTodo(prevState.doneTodos);
    
  }
  // --- redo
  function handleRedo() {
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length-1];
    if (!nextState || !nextState.todos || !nextState.doneTodos) return;

    setRedoStack(prev => prev.slice(0, prev.length - 1));
    
    setUndoStack(prev => [...prev, { todos, doneTodos }]);

    setTodos(nextState.todos);
    setdoneTodos(nextState.doneTodos);

    persistTodo(nextState.todos);
    persistFinishedTodo(nextState.doneTodos);
  }
  // ---

  function addNewTodo(newTodo) {
    const newList = [...todos, newTodo];
    setUndoStack(prev => [...prev, {
      todos,
      doneTodos,
    }]);
    persistTodo(newList)
    setTodos(newList);
  }

  function deleteTodo(index) {
    const newTodoList = todos.filter((todos, todoIdx) => {
      return todoIdx != index;
    })
    setUndoStack(prev => [...prev, {
      todos,
      doneTodos,
    }]);
    persistTodo(newTodoList)
    setTodos(newTodoList);
  }

  function editTodo(index) {
    const valueToBeEdited = todos[index];
    setUndoStack(prev => [...prev, {
      todos,
      doneTodos,
    }]);
    setTodoVal(valueToBeEdited);
    deleteTodo(index);
  }

  function markTodoComplete(index) {
    const completedTodo = todos[index];
    const newCompletedTodoList = [...doneTodos, completedTodo];
    setUndoStack(prev => [...prev, {
      todos,
      doneTodos,
    }]);
    persistFinishedTodo(newCompletedTodoList);
    setdoneTodos(newCompletedTodoList);
    deleteTodo(index);
  }

  function deleteCompTodo(index) {
    const newCompTodoList = doneTodos.filter((todos, todoIdx) => {
        return todoIdx != index;
    })
    setUndoStack(prev => [...prev, {
      todos,
      doneTodos,
    }]);
    persistFinishedTodo(newCompTodoList)
    setdoneTodos(newCompTodoList);
  }

  useEffect(() => {
    if (!localStorage) return;
    
    let localTodos = localStorage.getItem('todos');
    
    if (!localTodos) return;

    localTodos = JSON.parse(localTodos).todos;

    setTodos(localTodos);

  }, [])

  useEffect(() => {
    if (!localStorage) return;
    
    let completions = localStorage.getItem('finishedtodos');

    if (!completions) return;

    completions = JSON.parse(completions).todos;

    setdoneTodos(completions);
  }, [])

  return (
    <main>
      <h1 className="app-title">📝 Todo Web App</h1>
      <p className="tagline">Your simple daily task manager</p>

      <TodoInputs todoVal={todoVal} setTodoVal={setTodoVal} handleTodos={addNewTodo} handleUndo={handleUndo} handleRedo={handleRedo} />
      <TodoList editTodo={editTodo} todos={todos} deleteTodo={deleteTodo} doneTodos={doneTodos} markTodoComplete={markTodoComplete} />
      <CompletedTodos completedTodoList={doneTodos} deleteCompTodo={deleteCompTodo} ></CompletedTodos>
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