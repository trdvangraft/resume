import React, { Component } from 'react';
import { Button, View } from 'react-native';

const TodoScreen = ({ navigation }) => {
    const { navigate } = navigation

    const todo = JSON.stringify(navigation.getParam('todo'))

    return (
        <View>

        </View>
    )
}

TodoScreen.navigationOptions = () => {
    return {
        title: 'Todo screen'
    }
}

export default TodoScreen