import { givenEmptyDatabase, givenTodo, givenTodos } from "../../helpers/database.helpers";
import { expect } from "@loopback/testlab";
import { TodoController } from "../../../controllers";
import { testdb } from "../../fixtures/datasources/testdb.datasource";
import { TodoRepository } from "../../../repositories";

describe('TodoController (integration)', () => {
    beforeEach(givenEmptyDatabase)

    it('creates a new todo', async () => {
        const todo = await givenTodo({ title: 'new title' })
        const controller = new TodoController(new TodoRepository(testdb))

        const result = await controller.find()

        expect(result).to.containEql(todo)
    })

    it('finds new todo', async () => {
        const todos = await Promise.all(givenTodos([{ title: 'a-todo' }, { title: 'b-todo', description: 'b-description' }]))
        const controller = new TodoController(new TodoRepository(testdb))

        const result = await controller.find()

        expect(result).to.containDeep(todos)
    })
})