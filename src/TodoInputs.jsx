export default function TodoInputs(props) {
    const { handleTodos, todoVal, setTodoVal, handleUndo, handleRedo } = props;
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
                placeholder="Enter a task..." 
            />

            <button onClick={() => {
                if (todoVal != '') {
                    handleTodos(todoVal);
                    setTodoVal('');
                }
            }}> Add </button>
        
            <div class="button-group">
                <button title="Undo Last Action" onClick={handleUndo}>
                    <i class="fa fa-undo"></i>
                </button>
                <button title="Redo Last Action" onClick={handleRedo}>
                    <i class="fa fa-redo"></i>
                </button>
            </div>
        </header>
    )
}