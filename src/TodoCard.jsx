export default function TodoCard(props) {
    const {children, deleteTodo, todoIdx, editTodo, markTodoComplete} = props;
    return (
        <li className="todoItem"> 
            <h5>{todoIdx+1}.</h5> {children}
            <div className="actionsContainer">
                <button onClick={() => {
                    markTodoComplete(todoIdx);
                }}>
                    <i class="fa-regular fa-square-check"></i>
                </button>

                <button onClick={() => {
                    deleteTodo(todoIdx);
                }}>
                    <i class="fa-solid fa-trash-can"></i>
                </button>

                <button onClick={() => {
                    editTodo(todoIdx);
                }}>
                <i class="fa-solid fa-pen-to-square"></i>                    
                </button>
            </div>
        </li>
    )
}