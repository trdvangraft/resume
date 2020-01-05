import React from 'react';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import TodoScreen from './src/TodoScreen';
import TodoListScreen from './src/TodoListScreen';
import AddTodoModel from './src/AddTodoModel';

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

export default () => {
  const theme = useColorScheme()

  return (
    <AppearanceProvider>
      <App theme={theme} />
    </AppearanceProvider>
  )
}
