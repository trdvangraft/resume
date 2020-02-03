import {TodoListRepository, TodoRepository} from '../../repositories';
import {testdb} from '../fixtures/datasources/testdb.datasource';
import {Todo, TodoList} from '../../models';

export async function givenEmptyDatabase() {
  let todoRepository: TodoRepository;
  // eslint-disable-next-line prefer-const
  let todoListRepository: TodoListRepository;

  // eslint-disable-next-line prefer-const
  todoRepository = new TodoRepository(testdb, async () => todoListRepository);

  todoListRepository = new TodoListRepository(
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
      tags: ['tag 1'],
    },
    data,
  );
}

export async function givenTodoList(
  todoListRepo: TodoListRepository,
  data?: Partial<TodoList>,
) {
  return todoListRepo.create(givenTodoListData(data));
}

export async function givenTodo(
  todoRepo: TodoRepository,
  data?: Partial<Todo>,
) {
  return todoRepo.create(givenTodoData(data));
}

export function givenTodos(
  todoRepo: TodoRepository,
  data: Array<Partial<Todo>> = [],
): Array<Promise<Todo>> {
  return data.map(todo => givenTodo(todoRepo, todo));
}

export function givenTodoLists(
  todoListRepo: TodoListRepository,
  data: Array<Partial<TodoList>> = [],
): Array<Promise<TodoList>> {
  return data.map(todoList => givenTodoList(todoListRepo, todoList));
}
