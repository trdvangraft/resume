import React, { Component, useState, useEffect } from 'react';
import { Button, View } from 'react-native';
import { ListItem } from 'react-native-material-ui';

const TodoListScreen = props => {
    const { navigate } = props.navigation
    const [todos, setTodos] = useState([])

    /**
     * The component did mount function, load the todos from the api
     */
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
        <View>
            <Button title="This is the todo go back" />
            {todos.map(todo => {
                <ListItem
                    divider
                    centerElement={{
                        primaryText: todo.title
                    }}
                />
            })}
        </View>
    )
}

TodoListScreen.navigationOptions = () => {
    return {
        title: 'Welcome todo list'
    }
}

export default TodoListScreen