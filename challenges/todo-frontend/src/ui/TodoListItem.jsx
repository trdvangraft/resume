import React, { memo } from 'react';

import {
    ListItem,
    Checkbox,
    IconButton,
    ListItemText,
    ListItemSecondaryAction,
} from '@material-ui/core';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';

const TodoListItem = memo(props => (
    <ListItem divider={props.divider}>
        <Checkbox
        onClick={props.onCheckBoxToggle}
        checked={props.done}
        disableRipple
        />
        <ListItemText primary={props.title} />
        <ListItemSecondaryAction>
            <IconButton aria-label="Delete Todo" onClick={props.onButtonClick}>
                <DeleteOutlined />
            </IconButton>
        </ListItemSecondaryAction>
    </ListItem>
));

export default TodoListItem;