import React, { Component } from 'react';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import TodoScreen from './src/TodoScreen';
import TodoListScreen from './src/TodoListScreen';
import AddTodoModel from './src/AddTodoModel';
import { AppLoading } from 'expo'
import * as Font from 'expo-font'; 

const MainNavigator = createStackNavigator({
  TodoList: { screen: TodoListScreen },
  Todo: { screen: TodoScreen }
})

const RootNavigator = createStackNavigator({
  Main: { screen: MainNavigator },
  AddTodoModal: { screen: AddTodoModel }
}, {
  mode: 'modal',
  headerMode: 'none'
})

const App = createAppContainer(RootNavigator)

export default class NativeApp extends Component {
  state = {
    fontsLoaded: false
  }

  componentDidMount() {
    Font.loadAsync({
      'MaterialCommunityIcons': require('react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf')
    }).then(() => this.setState({ fontsLoaded: true }))
  }

  render() {
    return !this.state.fontsLoaded ? <AppLoading /> : <App />
  }
}
