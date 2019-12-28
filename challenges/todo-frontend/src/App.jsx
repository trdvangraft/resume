import React, { memo, useState, useCallback, useEffect } from 'react';

import Layout from './ui/Layout';

import AddTodo from './ui/AddTodo';
import TodoList from './ui/TodoList';

/**
 * The heart of the application where the logic is created
 */
const TodoApp = memo(() => {
    const [todos, setTodos] = useState([])

    /**
     * The component did mount function, load the todos from the api
     */
    useEffect(() => {
        fetch(`http://127.0.0.1:5000/v1/todo`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(response => setTodos(response))
            .catch(err => console.log(err))
    }, [])

    /**
     * The callback function that allows the todo to be removed
     * idx : String, the id of the todo to be removed
     */
    const itemRemove = useCallback(idx => {
        fetch(`http://127.0.0.1:5000/v1/todo/${idx}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(response => setTodos(response))
            .catch(err => console.log(err))
    }, [])

    /**
     * The callback function that allows the todo to be checked
     * idx : String, the id of the todo to be checked
     */
    const itemCheck = useCallback(idx => {
        const todo = todos.find(todo => todo._id === idx)
        const done = todo.done === "True" ? "False" : "True"

        fetch(`http://127.0.0.1:5000/v1/todo/${idx}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                done: done
            })
        })
            .then(res => res.json())
            .then(response => {
                const newTodos = todos.map(todo => todo._id === idx ? response[0] : todo)
                setTodos(newTodos)
            })
            .catch(err => console.log(err))
    })

    /**
     * The callback function that allows the todo to be created
     * inputTitle : String, the title of the todo to be created
     * inputDescription : String, the description of the todo to be created
     */
    const itemAdd = useCallback((inputTitle, inputDescription) => {
        fetch(`http://127.0.0.1:5000/v1/todo`, {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: inputTitle,
                description: inputDescription,
                done: "False"
            })
        })
            .then(res => res.json())
            .then(todo => setTodos([...todos, todo[0]]))
    })

    return (
        <Layout>
            <AddTodo
                addTodo={itemAdd}
            />
            <TodoList
                todos={todos}
                itemRemove={itemRemove}
                itemCheck={itemCheck}
            />
        </Layout>
    );
})

export default TodoApp