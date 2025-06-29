import TodoList from "./TodoList"
import TodoInputs from "./TodoInputs"
import CompletedTodos from "./CompletedTodos";
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useState, useEffect, useRef } from "react";

function App() {

  // Data
  let flag = false;
  const ignoreSave = useRef(false);
  const [todos, setTodos] = useState([]);
  const [doneTodos, setdoneTodos] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareRef = useRef();
  const [todoVal, setTodoVal] = useState('');
  // ---

  async function saveTodoDataToFirebase(todos, doneTodos, type) {
    const randomId = Math.random().toString(36).slice(2);
    if (type === 'todos') await setDoc(doc(db, "sharedTodos", randomId), { todos, type });
    if (type === 'done') await setDoc(doc(db, "sharedTodos", randomId), { doneTodos, type });
    else await setDoc(doc(db, "sharedTodos", randomId), {
      todos,
      doneTodos,
      type
    });
    return randomId;
  }

  async function handleShare(type) {
    const id = await saveTodoDataToFirebase(todos, doneTodos, type);
    const shareURL = `${window.location.origin}?shareId=${id}`;
    navigator.clipboard.writeText(shareURL);
    alert('Link copied! Share it with anyone.');
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get("shareId");

    if (shareId) {
      ignoreSave.current = true;
      async function fetchShared() {
        const docRef = doc(db, "sharedTodos", shareId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.type == 'todos') {
            setTodos(data.todos, []);
            setdoneTodos([])
          }
          else if (data.type == 'done') {
            setTodos([]);
            setdoneTodos(data.doneTodos, []);
          }
          else {
            setTodos(data.todos, []);
            setdoneTodos(data.doneTodos, []);
          }
        }
      }
      fetchShared();
    } else {
      ignoreSave.current = false
      if (!localStorage) return;

      let localTodos = localStorage.getItem('todos');
      let completions = localStorage.getItem('finishedtodos');

      if (localTodos) {
        localTodos = JSON.parse(localTodos).todos;
        setTodos(localTodos);
      }
      if (completions) {
        completions = JSON.parse(completions).todos;
        setdoneTodos(completions);
      }
    }
  }, []);

  // Data Saving & Persistance

  function persistTodo(newData) {
    if (ignoreSave.current) return;
    else localStorage.setItem('todos', JSON.stringify({ todos: newData }));
  }

  function persistFinishedTodo(newData) {
    if (ignoreSave.current) return;
    else localStorage.setItem('finishedtodos', JSON.stringify({ todos: newData }));
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

    const nextState = redoStack[redoStack.length - 1];
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
    setRedoStack([]);
    const newList = [...todos, newTodo];
    setUndoStack(prev => [...prev, {
      todos,
      doneTodos,
    }]);
    persistTodo(newList)
    setTodos(newList);
  }

  function deleteTodo(index) {
    setRedoStack([]);
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
    setRedoStack([]);
    const valueToBeEdited = todos[index];
    setUndoStack(prev => [...prev, {
      todos,
      doneTodos,
    }]);
    setTodoVal(valueToBeEdited);
    deleteTodo(index);
  }

  function markTodoComplete(index) {
    setRedoStack([]);
    const completedTodo = todos[index];
    const newCompletedTodoList = [...doneTodos, completedTodo];
    persistFinishedTodo(newCompletedTodoList);
    deleteTodo(index);
    setdoneTodos(newCompletedTodoList);
  }

  function deleteCompTodo(index) {
    setRedoStack([]);
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

  // useEffect(() => {
  //   if (!localStorage) return;

  //   let localTodos = localStorage.getItem('todos');

  //   if (!localTodos) return;

  //   localTodos = JSON.parse(localTodos).todos;

  //   setTodos(localTodos);

  // }, [])

  // useEffect(() => {
  //   if (!localStorage) return;

  //   let completions = localStorage.getItem('finishedtodos');

  //   if (!completions) return;

  //   completions = JSON.parse(completions).todos;

  //   setdoneTodos(completions);
  // }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setShowShareOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

      <div className="share-menu" ref={shareRef}>
        <button onClick={() => setShowShareOptions(!showShareOptions)}>🔗 Share</button>

        {showShareOptions && (
          <div className="share-options">
            <button onClick={() => handleShare('todos')}>Share Todos</button>
            <button onClick={() => handleShare('done')}>Share Completed</button>
            <button onClick={() => handleShare('both')}>Share All</button>
          </div>
        )}
      </div>
    </main>
  )
}

export default App