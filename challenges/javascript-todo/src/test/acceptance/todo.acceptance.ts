/* eslint-disable @typescript-eslint/no-misused-promises */
import {setupApplication} from '../helpers/app.helpers';
import {givenEmptyDatabase, givenTodo} from '../helpers/database.helpers';
import {expect, Client} from '@loopback/testlab';

import {TodoApp} from '../..';
import {Todo} from '../../models';
import {TodoRepository, TodoListRepository} from '../../repositories';
import {testdb} from '../fixtures/datasources/testdb.datasource';

describe('Todo (acceptance)', async () => {
  let app: TodoApp;
  let client: Client;

  let todoRepo: TodoRepository;
  let todoListRepo: TodoListRepository;

  before(givenEmptyDatabase);
  before(init);
  before(
    'setupApplication',
    async () => ({app, client} = await setupApplication()),
  );

  after(async () => {
    await app.stop();
  });

  it('retrieve todos', async () => {
    const todo = await givenTodo(todoRepo, {
      title: 'Create an awesome API',
      description: 'Api creation has never been so easy',
      status: 'Pending',
      todoListId: '1',
    });

    const expected = Object.assign({}, todo);
    expected.id = todo.getId().toString();

    const resp = await client.get('/todos');
    expect(resp.body).to.containEql(expected);
  });

  function init() {
    todoListRepo = new TodoListRepository(testdb, async () => todoRepo);
    todoRepo = new TodoRepository(testdb, async () => todoListRepo);
  }
});
