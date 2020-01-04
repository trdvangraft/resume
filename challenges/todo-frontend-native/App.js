import React from 'react';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import TodoScreen from './src/TodoScreen';
import TodoListScreen from './src/TodoListScreen';

const MainNavigator = createStackNavigator({
  TodoList: { screen: TodoListScreen },
  Todo: { screen: TodoScreen }
})

const App = createAppContainer(MainNavigator)

export default () => {
  const theme = useColorScheme()

  return (
    <AppearanceProvider>
      <App theme={theme} />
    </AppearanceProvider>
  )
}
