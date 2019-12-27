import React, { memo } from 'react';
import { TextField, Paper, Button, Grid } from '@material-ui/core';

const AddTodo = memo(props => (
        <Paper style={{ margin: 16, padding: 16 }}>
            <Grid container>
                <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
                    <TextField
                    placeholder="Add Todo title here"
                    value={props.inputValue}
                    onChange={props.onInputChange}
                    onKeyPress={props.onInputKeyPress}
                    name="title"
                    fullWidth
                    />
                </Grid>
                <Grid xs={2} md={1} item>
                    <Button
                    fullWidth
                    color="secondary"
                    variant="outlined"
                    onClick={props.onButtonClick}
                    >
                        Add
                    </Button>
                </Grid>
                <Grid xs={12} item>
                    <TextField
                        placeholder="Todo description"
                        value={props.inputDescription}
                        onChange={props.onInputChange}
                        onKeyPress={props.onInputKeyPress}
                        name="description"
                        fullWidth
                        multiline
                        rows="4"
                    />
                </Grid>
            </Grid>
        </Paper>
    
));

export default AddTodo;