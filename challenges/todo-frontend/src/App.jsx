import React, { memo } from 'react';
import ReactDOM from 'react-dom';

import { useInputValue, useTodos } from './TodoLogic';

import Layout from './ui/Layout';

import AddTodo from './ui/AddTodo';
import TodoList from './ui/TodoList';

const TodoApp = memo(props => {
    const { inputValue, changeInput, clearInput, keyInput } = useInputValue();
    const { todos, addTodo, checkTodo, removeTodo } = useTodos();

    const clearInputAndAddTodo = _ => {
        clearInput();
        addTodo(inputValue);
    };
    
    return (
        <Layout>
            <AddTodo
                inputValue={inputValue}
                onInputChange={changeInput}
                onButtonClick={clearInputAndAddTodo}
                onInputKeyPress={event => keyInput(event, clearInputAndAddTodo)}
            />
            <TodoList
                items={todos}
                onItemCheck={idx => checkTodo(idx)}
                onItemRemove={idx => removeTodo(idx)}
            />
        </Layout>
    );
})

export default TodoApp