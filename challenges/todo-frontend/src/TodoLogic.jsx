import { useState } from "react";

export const useInputValue = (initialValue = '') => {
    const [inputTitle, setInputTitle] = useState(initialValue)
    const [inputDescription, setInputdescription] = useState(initialValue)

    return {
        inputTitle,
        inputDescription,
        changeInput: e => e.target.name === 'title' ? setInputTitle(e.target.value) : setInputdescription(e.target.value),
        clearInput: () => {
            setInputTitle('')
            setInputdescription('')
        },
        keyInput: (e, c) => {
            if (e.which === 13 || e.keyCode === 13) {
                c(inputTitle)
                return true
            }
            return false
        }
    }
}

export const useTodos = () => {
    return {
        addTodo: (title, description) => {
            fetch(`http://127.0.0.1:5000/v1/todo`, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description,
                    done: "False"
                })
            })
        },
        checkTodo: idx => {
            fetch(`http://127.0.0.1:5000/v1/todo/${idx}`, {
                method: "put",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    done: "True"
                })
            })
        },
        removeTodo: idx => {
            console.log(idx)
        }
    }
}