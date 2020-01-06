import { API_URL } from "react-native-dotenv";
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import axios from 'axios';
import {  FAB, IconButton } from 'react-native-paper';
import TodoListItem from './TodoListItem'

const TodoListScreen = props => {
    const { navigate } = props.navigation
    const [todos, setTodos] = useState([])
    const [shouldRefresh, setShouldRefresh] = useState(false)
    const [scrollEnabled, setScrollEnabled] = useState(true)

    /**
     * The component did mount function, load the todos from the api
     */
    useEffect(() => {
        console.log(API_URL)
        axios.get(`${API_URL}/v1/todo`)
            .then(response => setTodos(response.data))
            .then(() => setShouldRefresh(false))
            .catch(err => {
                setShouldRefresh(false)
                console.log(err)
            })
    }, [shouldRefresh])

    const onModalDismiss = () => setShouldRefresh(true)
    const onItemPress = todo => navigate('Todo', { todo: todo, todoID: '1' })
    const updateScroll = enabled => setScrollEnabled(enabled)

    const onItemDelete = useCallback(item => {
        fetch(`${API_URL}/v1/todo/${item._id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(response => setShouldRefresh(true))
            .catch(err => console.log(err))
    })

    return (
        <View style={styles.container}>
            <FlatList
                data={todos}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <TodoListItem
                        item={item}
                        onItemPress={onItemPress}
                        updateScroll={updateScroll}
                        onItemDelete={onItemDelete}
                    />
                )}
                onRefresh={() => setShouldRefresh(true)}
                refreshing={shouldRefresh}
                scrollEnabled={scrollEnabled}
            />
            <FAB
                icon="plus"
                onPress={() => navigate('AddTodoModal', { onModalDismiss: onModalDismiss})}
                style={styles.fab}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fab: {
        margin: 0,
        top: 'auto',
        bottom: 20,
        right: 20,
        position: 'absolute',
    }
});

TodoListScreen.navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}

    return {
        headerRight: () => <IconButton icon="plus" size={28} onPress={() => navigation.navigate('AddTodoModal')}/>,
        title: 'Welcome todo list'
    }
}

export default TodoListScreen