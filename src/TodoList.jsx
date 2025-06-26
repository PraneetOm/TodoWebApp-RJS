import React from "react"
import TodoCard from './TodoCard'

export default function TodoList(props) {
    const {todos} = props;
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p className="emoji">🎉</p>
        <h2>All caught up!</h2>
        <p>You have no tasks right now. Add one above 👆</p>
      </div>
    );
  }
    return (
        <>
            <div class='seperator'>
                Incomplete Tasks
            </div>
            <ul className="main">
                {todos.map((todo, todoIdx) => {
                    return (
                        <TodoCard {...props} todoIdx={todoIdx} key = {todoIdx}> 
                        <p> {todo} </p>
                        </TodoCard>
                    )
                })}
            </ul>
        </>
    )
}