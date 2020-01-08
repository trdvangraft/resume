import { API_URL } from "react-native-dotenv";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import axios from 'axios';
import {  FAB, IconButton, Snackbar } from 'react-native-paper';
import TodoListItem from './TodoListItem'

const TodoListScreen = props => {
    const { navigate } = props.navigation
    const [todos, setTodos] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [scrollEnabled, setScrollEnabled] = useState(true)
    const [hasError, setHasError] = useState(false)
    const shouldPopulateData = useRef(true)

    /**
     * The component did mount function, load the todos from the api
     */
    useEffect(() => fetchTodos(), [])

    const fetchTodos = () => {
        console.log(API_URL)
        axios.get(`${API_URL}/v1/todo`)
            .then(response => setTodos(response.data))
            .then(() => setIsRefreshing(false))
            .then(() => shouldPopulateData.current = false)
            .catch(err => {
                console.log(`an error occured when loading data ${err}`)
                setIsRefreshing(false)
                setHasError(true)
        })
    }
    const onModalDismiss = (hasNewTodo = false) => setIsRefreshing(hasNewTodo)
    const onItemPress = todo => navigate('Todo', { todo: todo })
    const updateScroll = enabled => setScrollEnabled(enabled)

    const onItemDelete = useCallback(item => {
        fetch(`${API_URL}/v1/todo/${item._id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(response => setIsRefreshing(true))
            .catch(err => console.log(err))
    })

    const onItemChange = item => navigate('AddTodoModal', {
        todo: item,
        onModalDismiss: onModalDismiss
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
                        onItemChange={onItemChange}
                    />
                )}
                onRefresh={() => fetchTodos()}
                refreshing={isRefreshing}
                scrollEnabled={scrollEnabled}
            />
            <FAB
                icon="plus"
                onPress={() => navigate('AddTodoModal', { onModalDismiss: onModalDismiss})}
                style={styles.fab}
            />
            <Snackbar
                visible={hasError}
                onDismiss={() => setHasError(false)}
                action={{
                    label: 'Retry',
                    accessibilityLabel: 'Retry loading todos',
                    onPress: () => {
                        fetchTodos()
                        setHasError(false)
                    }
                }}
            >
                Failed loading todos
            </Snackbar>
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