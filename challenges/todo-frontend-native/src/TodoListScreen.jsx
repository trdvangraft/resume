import { API_URL } from "react-native-dotenv";
import React, { Component, useState, useEffect, memo } from 'react';
import { Button, View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { ListItem } from 'react-native-material-ui';
import axios from 'axios';
import { Icon } from 'react-native-material-ui';
import { ActionButton } from 'react-native-material-ui';
import { MaterialHeaderButtons, Item } from "./HeaderIcons";

const TodoListScreen = props => {
    const { navigate } = props.navigation

    return (
        <View style={styles.container}>
            <TodoList
                onItemPress={todo => {
                    navigate('Todo', {
                        todo: todo
                    })
                }}
            />
            <ActionButton
                icon="add-circle"
                onPress={() => navigate('AddTodoModal')}
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
        left: 20,
        bottom: 20,
        right: 'auto',
        position: 'absolute',
    },
});

TodoListScreen.navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}

    return {
        headerRight: () => (
            <MaterialHeaderButtons>
                <Item title="add" iconName="add-circle" onPress={() => navigation.navigate('AddTodoModal')} />
            </MaterialHeaderButtons>
        ),
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
            onRefresh={() => setShouldRefresh(true)}
            refreshing={shouldRefresh}
        />
    )
}

export default TodoListScreen