import React, { Component, useEffect } from 'react';
import { StyleSheet, Button, View } from 'react-native';
import { Card, Title, Paragraph, Avatar } from 'react-native-paper';

const TodoScreen = ({ navigation }) => {
    const todo = JSON.parse(JSON.stringify(navigation.getParam('todo')))

    return (
        <View style={styles.container}>
            <Card>
                <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                <Card.Content>
                    <Title>{todo.title}</Title>
                    <Paragraph>{todo.description}</Paragraph>
                </Card.Content>
            </Card>
        </View>
    )
}

TodoScreen.navigationOptions = () => {
    return {
        title: 'Todo screen'
    }
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        padding: 16
    }
})

export default TodoScreen