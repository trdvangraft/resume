import { API_URL } from "react-native-dotenv";
import React, { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet, SafeAreaView } from "react-native"
import { TextInput, Button } from 'react-native-paper';
import Constants from 'expo-constants';
import axios from 'axios';

const FormInput = props => {
    return (
        <TextInput
            {...props}
            editable
            style={{
                backgroundColor: '#fff'
            }}
            mode="outlined"
            inlineImageLeft='search_icon'
        />
    )
}

const AddTodoModel = props => {
    const submitTodo = (title, description) => addTodo(title, description)
    const { onModalDismiss, todo } = props.navigation.state.params
    let createdNewTodo = false

    /**
     * Run the `componentWillUnmount` as an effect,
     * called when the modal is being closed
     */
    useEffect(() => {
        return () => {
            onModalDismiss(createdNewTodo)
        }
    })

    const addTodo = useCallback((title, description) => {
        console.log(`API ${API_URL}`)
        console.log(`title: ${title} description: ${description}`)
        axios.post(`${API_URL}/v1/todo`, {
            "title": title,
            "description": description,
            "done": "False"
        })
            .then(() => createdNewTodo = true)
            .then(() => props.navigation.goBack())
    })

    const editTodo = useCallback((title, description) => {
        axios.put(`${API_URL}/v1/todo/${todo._id}`, {
            "title": title,
            "description": description
        })
            .then(() => createdNewTodo = true)
            .then(() => props.navigation.goBack())
            .catch(err => console.log(err))            
    })

    return (
        <AddTodoModelForm 
            submitTodo={submitTodo}
            editTodo={editTodo}
            dismiss={() => props.navigation.goBack()}
            todo={todo}
        />
    )
}

const AddTodoModelForm = ({ submitTodo, editTodo, dismiss, todo }) => {
    const [title, setTitle] = useState(todo ? todo.title : '')
    const [description, setDescription] = useState(todo ? todo.description : '')

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.child}>
                <FormInput
                    label="Title"
                    onChangeText={title => setTitle(title)}
                    value={title}
                    returnKeyLabel={'next'}
                />
                <FormInput
                    label="Description"
                    multiline
                    numberOfLines={4}
                    onChangeText={description => setDescription(description)}
                    value={description}
                    returnKeyLabel={'done'}
                />
            </View>
            <View style={styles.buttons}>
                <Button
                    style={styles.button}
                    onPress={() => dismiss()}
                    mode="outlined"
                    icon="delete"
                    accessibilityLabel="Dismiss"
                >Dismiss</Button>
                {todo ? 
                    <Button
                        style={styles.button}
                        onPress={() => editTodo(title, description)}
                        mode="contained"
                        icon="check"
                        accessibilityLabel="Update"
                    >Update</Button>
                : 
                    <Button
                        style={styles.button}
                        onPress={() => submitTodo(title, description)}
                        mode="contained"
                        icon="check"
                        accessibilityLabel="Submit"
                    >Submit</Button>        
                }
                
            </View>
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: Constants.statusBarHeight,
        padding: 16,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    child: {
        margin: 5
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        borderRadius: 8,
        padding: 8,
    }
});

export default AddTodoModel