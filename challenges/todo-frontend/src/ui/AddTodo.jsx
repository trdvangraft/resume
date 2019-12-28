import React, { memo, useState } from 'react';
import { TextField, Paper, Button, Grid } from '@material-ui/core';

/**
 * The add todo component that allows todo's to be created
 */
const AddTodo = memo(props => {
    const [inputTitle, setInputTitle] = useState('')
    const [inputDescription, setInputdescription] = useState('')

    /**
     * The function to change either the title or the description of the upcomming todo
     * @param {Event} e the event when the field changes
     */
    const onInputChange = e => e.target.name === 'title' ? setInputTitle(e.target.value) : setInputdescription(e.target.value)

    /**
     * The submit function, which clears the title and description
     */
    const submitTodo = () => {
        props.addTodo(inputTitle, inputDescription)
        setInputTitle('')
        setInputdescription('')
    }

    /**
     * The function that checks if enter is pressed and than sends the todo to the api
     * @param {Event} e the event when a key is pressed
     */
    const onInputKeyPress = e => {
        if (e.which === 13 || e.keyCode === 13) {
            submitTodo()
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