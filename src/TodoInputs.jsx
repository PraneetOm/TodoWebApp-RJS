import React, { useState } from "react"

export default function TodoInputs(props) {
    const { handleTodos, todoVal, setTodoVal } = props;
    return (
        <header>
            <input 
                value={todoVal} 
                onChange={(e) => {
                    setTodoVal(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key == 'Enter' && todoVal != '') {
                        handleTodos(todoVal);
                        setTodoVal('');
                    }
                }}
                placeholder="Enter a task..." />

            <button onClick={() => {
                if (todoVal != '') {
                    handleTodos(todoVal);
                    setTodoVal('');
                }
            }}> Add </button>
        </header>
    )
}