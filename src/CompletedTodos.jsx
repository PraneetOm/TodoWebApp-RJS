export default function CompletedTodos(props) {
    const {completedTodoList = [], deleteCompTodo} = props;
    if (completedTodoList.length === 0) return;

    return (
        <>
            <div className='seperator'>
                ✔️ Done & Dusted: {completedTodoList.length}
            </div>

            <ul class='main'>
                {completedTodoList.map((todo, index) => {
                    return (
                        <li key={index} className="todoItem">
                            <h5> {index+1}. </h5> 
                            <p> {todo} </p> 
                            
                            <button class='compButton' onClick={() => {
                                    deleteCompTodo(index);
                                }}>
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}