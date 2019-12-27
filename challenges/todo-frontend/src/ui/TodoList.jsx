import React, { memo, useEffect, useState } from 'react';
import { List, Paper } from '@material-ui/core';

import TodoListItem from './TodoListItem';

const TodoList = memo(props => {
    const [todos, setTodos] = useState([])

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/v1/todo`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(response => setTodos(response))
            .catch(err => console.log(err))
    }, [])
    
    return (
        <>
           {todos.length > 0 && (
                <Paper style={{ margin: 16 }}>
                    <List>
                        {todos.map((todo, idx) => (
                            <TodoListItem
                                {...todo}
                                key={`TodoItem.${todo._id}`}
                                divider={idx !== todos.length - 1}
                                onButtonClick={() => props.onItemRemove(todo._id)}
                                onCheckBoxToggle={() => props.onItemCheck(todo._id)}
                            />
                        ))}
                    </List>
                </Paper>
            )}
        </> 
    )
        
});

export default TodoList;