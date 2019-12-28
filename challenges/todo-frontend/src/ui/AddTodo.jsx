import React, { memo, useState } from 'react';
import { TextField, Paper, Button, Grid } from '@material-ui/core';

const AddTodo = memo(props => {
    const [inputTitle, setInputTitle] = useState('')
    const [inputDescription, setInputdescription] = useState('')

    const onInputChange = e => e.target.name === 'title' ? setInputTitle(e.target.value) : setInputdescription(e.target.value)

    const submitTodo = () => {
        props.addTodo(inputTitle, inputDescription)
        setInputTitle('')
        setInputdescription('')
    }

    const onInputKeyPress = (e, c) => {
        if (e.which === 13 || e.keyCode === 13) {
            c(inputTitle)
            return true
        }
        return false
    }
        
    return (
        <>
            <Paper style={{ margin: 16, padding: 16 }}>
                <Grid container>
                    <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
                        <TextField
                        placeholder="Add Todo title here"
                        value={inputTitle}
                        onChange={onInputChange}
                        onKeyPress={onInputKeyPress}
                        name="title"
                        fullWidth
                        />
                    </Grid>
                    <Grid xs={2} md={1} item>
                        <Button
                        fullWidth
                        color="secondary"
                        variant="outlined"
                        onClick={submitTodo}
                        >
                            Add
                        </Button>
                    </Grid>
                    <Grid xs={12} item>
                        <TextField
                            placeholder="Todo description"
                            value={inputDescription}
                            onChange={onInputChange}
                            onKeyPress={onInputKeyPress}
                            name="description"
                            fullWidth
                            multiline
                            rows="4"
                        />
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
});

export default AddTodo;