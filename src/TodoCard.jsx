export default function TodoCard(props) {
    const {children, deleteTodo, todoIdx, editTodo} = props;
    return (
        <li className="todoItem"> 
            {children}
            <div className="actionsContainer">

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