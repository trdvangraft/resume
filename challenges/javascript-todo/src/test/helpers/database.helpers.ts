import {TodoListRepository, TodoRepository} from '../../repositories';
import {testdb} from '../fixtures/datasources/testdb.datasource';
import {Todo, TodoList} from '../../models';

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
      status: 'pending',
      color: '#24ef01',
    },
    data,
  );
}

export function givenTodoListData(data?: Partial<TodoList>) {
  return Object.assign(
    {
      title: 'basic-todo-list',
      description: 'basic-description',
      creationDate: Date.now(),
    },
    data,
  );
}

export async function givenTodoList(data?: Partial<TodoList>) {
  return new TodoListRepository(
    testdb,
    async () => new TodoRepository(testdb),
  ).create(givenTodoListData(data));
}

export async function givenTodo(data?: Partial<Todo>) {
  return new TodoRepository(testdb).create(givenTodoData(data));
}

export function givenTodos(
  data: Array<Partial<Todo>> = [],
): Array<Promise<Todo>> {
  return data.map(todo => givenTodo(todo));
}

export function givenTodoLists(
  data: Array<Partial<TodoList>> = [],
): Array<Promise<TodoList>> {
  return data.map(todoList => givenTodoList(todoList));
}
