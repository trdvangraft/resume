import React, { useState, useCallback } from 'react'
import { View, StyleSheet, SafeAreaView } from "react-native"
import { TextInput, Button } from 'react-native-paper';
import Constants from 'expo-constants';
import * as Font from 'expo-font';

const FormInput = props => {
    return (
        <TextInput
            {...props}
            editable
        />
    )
}

const AddTodoModel = props => {
    const [title, setTitle] = useState('Title')
    const [description, setDescription] = useState('Description')

    const submitTodo = () => {
        props.navigation.goBack()
    }

    const addTodo = useCallback((title, description) => {
        
    })

    return (
        <SafeAreaView style={styles.container}>
            <FormInput
                onChangeText={title => setTitle(title)}
                value={title}
            />
            <FormInput
                multiline
                numberOfLines={4}
                onChangeText={description => setDescription(description)}
                value={description}
            />
            <View style={styles.buttons}>
                <Button
                    style={styles.button}
                    onPress={() => props.navigation.goBack()}
                    mode="outlined"
                    icon="camera"
                >Dismiss</Button>
                <Button
                    style={styles.button}
                    onPress={() => submitTodo()}
                    mode="contained"
                    icon="camera"
                >Submit</Button>
            </View>
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: Constants.statusBarHeight,
        flex: 1,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    button: {
        borderRadius: 16,
        padding: 16,
    }
});

export default AddTodoModel