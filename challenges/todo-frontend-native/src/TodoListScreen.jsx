import React, { Component } from 'react';
import { Button } from 'react-native';

class TodoListScreen extends Component {
    static navigationOptions = {
        title: "Welcome"
    }

    render() {
        const { navigate } = this.props.navigation
        return (
            <Button
                title="Go to Todo's"
                onPress={() => navigate('Todo', { todo: 'Test' })}
            />
        )
    }
}

export default TodoListScreen