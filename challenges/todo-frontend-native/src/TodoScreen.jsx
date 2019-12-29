import React, { Component } from 'react';
import { Button } from 'react-native';

class TodoScreen extends Component {
    static navigationOptions = {
        title: "Todo screen"
    }

    render() {
        const { navigate } = this.props.navigation
        return (
            <Button
                title="This is the todo go back"
                onPress={() => navigate('TodoList', { todo: 'Test' })}
            />
        )
    }
}

export default TodoScreen