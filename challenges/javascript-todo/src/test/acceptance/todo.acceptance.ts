/* eslint-disable @typescript-eslint/no-misused-promises */
import {setupApplication} from '../helpers/app.helpers';
import {givenEmptyDatabase, givenTodo} from '../helpers/database.helpers';
import {expect, Client} from '@loopback/testlab';
import {TodoApp} from '../..';
import {Todo} from '../../models';

describe('Todo (acceptance)', async () => {
  let app: TodoApp;
  let client: Client;

  before(givenEmptyDatabase);
  before(
    'setupApplication',
    async () => ({app, client} = await setupApplication()),
  );

  after(async () => {
    await app.stop();
  });

  it('retrieve todos', async () => {
    const todo = await givenTodo({
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
});
