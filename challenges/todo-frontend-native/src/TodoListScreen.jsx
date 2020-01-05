import { API_URL } from "react-native-dotenv";
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import { List, FAB, IconButton } from 'react-native-paper';

const TodoListScreen = props => {
    const { navigate } = props.navigation
    const onModalDismiss = () => {
        console.log('modal closing')
    }

    return (
        <View style={styles.container}>
            <TodoList
                onItemPress={todo => {
                    navigate('Todo', {
                        todo: todo
                    })
                }}
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
    },
});

TodoListScreen.navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}

    return {
        headerRight: () => <IconButton icon="plus" size={28} onPress={() => navigation.navigate('AddTodoModal')}/>,
        title: 'Welcome todo list'
    }
}

const TodoList = ({ onItemPress }) => {
    const [todos, setTodos] = useState([])
    const [shouldRefresh, setShouldRefresh] = useState(false)

    /**
     * The component did mount function, load the todos from the api
     */
    useEffect(() => {
        axios.get(`${API_URL}/v1/todo`)
            .then(response => setTodos(response.data))
            .then(() => setShouldRefresh(false))
            .catch(err => console.log(err))
    }, [shouldRefresh])

    return (
        <FlatList
            data={todos}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
                <List.Item
                    id={item._id}
                    divider
                    title={item.title}
                    description={item.description}
                    onPress={() => onItemPress(item)}
                />
            )}
            onRefresh={() => setShouldRefresh(true)}
            refreshing={shouldRefresh}
        />
    )
}

export default TodoListScreen