import React, { memo } from 'react';
import { List, Paper } from '@material-ui/core';

import TodoListItem from './TodoListItem';

const TodoList = memo(props => {
    return (
        <>
           {props.todos.length > 0 && (
                <Paper style={{ margin: 16 }}>
                    <List>
                        {props.todos.map((todo, idx) => (
                            <TodoListItem
                                {...todo}
                                key={`TodoItem.${todo._id}`}
                                divider={idx !== props.todos.length - 1}
                                onButtonClick={() => props.itemRemove(todo._id)}
                                onCheckBoxToggle={() => props.itemCheck(todo._id)}
                            />
                        ))}
                    </List>
                </Paper>
            )}
        </> 
    )
        
});

export default TodoList;