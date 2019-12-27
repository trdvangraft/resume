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

export const useTodos = (initialValue = []) => {
    const [todos, setTodos] = useState(initialValue)

    return {
        todos,
        addTodo: (title, description) => {

        },
        checkTodo: idx => {
            console.log(idx)
        },
        removeTodo: idx => {
            
        }
    }
}