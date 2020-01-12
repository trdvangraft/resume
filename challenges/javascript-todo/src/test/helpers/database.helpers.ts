import {TodoListRepository, TodoRepository} from '../../repositories';
import {testdb} from '../fixtures/datasources/testdb.datasource';
import {Todo} from '../../models';

export async function givenEmptyDatabase() {
  const todoRepository: TodoRepository = new TodoRepository(testdb);
  const todoListRepository: TodoListRepository = new TodoListRepository(
    testdb,
    async () => todoRepository,
  );

  await todoRepository.deleteAll();
  await todoListRepository.deleteAll();
}

export function givenTodoData(data?: Partial<Todo>) {
  return Object.assign(
    {
      title: 'todo-title',
      description: 'todo-description',
    },
    data,
  );
}

export async function givenTodo(data?: Partial<Todo>) {
  return new TodoRepository(testdb).create(givenTodoData(data));
}

export function givenTodos(
  data: Array<Partial<Todo>> = [],
): Array<Promise<Todo>> {
  return data.map(todo =>
    new TodoRepository(testdb).create(givenTodoData(todo)),
  );
}
