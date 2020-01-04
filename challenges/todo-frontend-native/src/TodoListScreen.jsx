import { API_URL } from "react-native-dotenv";
import React, { Component, useState, useEffect, memo } from 'react';
import { Button, View, Text, FlatList } from 'react-native';
import { ListItem } from 'react-native-material-ui';
import axios from 'axios';

const TodoListScreen = props => {
    const { navigate } = props.navigation
    const [todos, setTodos] = useState([])
    const [shouldRefresh, setShouldRefresh] = useState(false)

    /**
     * The component did mount function, load the todos from the api
     */
    useEffect(() => {
        axios.get(`${API_URL}/v1/todo`)
            .then(response => {
                console.log(response.data)
                setTodos(response.data)
            })
            .catch(err => console.log(err))
    }, [shouldRefresh])

    return (
        <View>
            <TodoList
                todos={todos}
                onItemPress={todo => {
                    navigate('Todo', {
                        todo: todo
                    })
                }}
            />
        </View>
    )
}

TodoListScreen.navigationOptions = () => {
    return {
        title: 'Welcome todo list'
    }
}

const TodoList = ({ todos, onItemPress }) => {
    return (
        <FlatList
            data={todos}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
                <ListItem
                    id={item._id}
                    divider
                    centerElement={{
                        primaryText: item.title,
                        secondaryText: item.description,
                    }}
                    onPress={() => onItemPress(item)}
                />
            )}
        />
    )
}

export default TodoListScreen