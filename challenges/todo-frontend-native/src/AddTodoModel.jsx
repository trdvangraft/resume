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

    /**
     * Run the `componentWillUnmount` as an effect,
     * called when the modal is being closed
     */
    useEffect(() => {
        return () => {
            props.navigation.state.params.onModalDismiss()
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
            .then(() => props.navigation.goBack())
    })

    return (
        <AddTodoModelForm 
            submitTodo={submitTodo}
            dismiss={() => props.navigation.goBack()}
        />
    )
}

const AddTodoModelForm = ({ submitTodo, dismiss }) => {
    const [title, setTitle] = useState('t')
    const [description, setDescription] = useState('t')

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
                <Button
                    style={styles.button}
                    onPress={() => submitTodo(title, description)}
                    mode="contained"
                    icon="check"
                    accessibilityLabel="Submit"
                >Submit</Button>
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