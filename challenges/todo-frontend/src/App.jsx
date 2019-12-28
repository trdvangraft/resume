import React, { memo } from 'react';
import ReactDOM from 'react-dom';

import { useInputValue, useTodos } from './TodoLogic';

import Layout from './ui/Layout';

import AddTodo from './ui/AddTodo';
import TodoList from './ui/TodoList';

const TodoApp = memo(props => {
    const { inputTitle, inputDescription, changeInput, clearInput, keyInput } = useInputValue();
    const { todos, addTodo, checkTodo, removeTodo } = useTodos();

    const clearInputAndAddTodo = _ => {
        clearInput();
        addTodo(inputTitle, inputDescription);
    };
    
    return (
        <Layout>
            <AddTodo
                inputTitle={inputTitle}
                inputDescription={inputDescription}
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