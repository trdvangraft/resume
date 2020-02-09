import {
  TodoListRepository,
  TodoRepository,
  UserRepository,
  FriendshipRepository,
  AttachmentRepository,
  UserCredentialsRepository,
} from '../../repositories';
import {testdb} from '../fixtures/datasources/testdb.datasource';
import {Todo, TodoList, User, Friendship, Attachment} from '../../models';

export async function givenEmptyDatabase() {
  const {
    todoRepo,
    todoListRepo,
    userRepo,
    friendshipRepo,
    attachmentRepo,
  } = await init();

  await todoRepo.deleteAll();
  await todoListRepo.deleteAll();
  await userRepo.deleteAll();
  await friendshipRepo.deleteAll();
  await attachmentRepo.deleteAll();
}

export async function init() {
  let todoRepo: TodoRepository;
  // eslint-disable-next-line prefer-const
  let todoListRepo: TodoListRepository;
  // eslint-disable-next-line prefer-const
  let userRepo: UserRepository;

  // eslint-disable-next-line prefer-const
  let friendshipRepo: FriendshipRepository;

  // eslint-disable-next-line prefer-const
  let attachmentRepo: AttachmentRepository;

  // eslint-disable-next-line prefer-const
  let userCredentials: UserCredentialsRepository;

  // eslint-disable-next-line prefer-const
  userRepo = new UserRepository(
    testdb,
    async () => todoListRepo,
    async () => friendshipRepo,
    async () => userCredentials,
  );
  // eslint-disable-next-line prefer-const
  todoRepo = new TodoRepository(testdb, async () => todoListRepo);
  friendshipRepo = new FriendshipRepository(testdb, async () => userRepo);
  userCredentials = new UserCredentialsRepository(testdb);

  todoListRepo = new TodoListRepository(
    testdb,
    async () => todoRepo,
    async () => userRepo,
    async () => attachmentRepo,
  );

  attachmentRepo = new AttachmentRepository(testdb, async () => todoListRepo);

  return {
    todoRepo,
    todoListRepo,
    friendshipRepo,
    userRepo,
    attachmentRepo,
  };
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

function givenUserData(data?: Partial<User>) {
  return Object.assign(
    {
      username: 'xxstaticfieldxx',
      firstname: 'Tijmen',
      lastname: 'van Graft',
      password: 'pass123',
    },
    data,
  );
}

function givenAttachmentData(data?: Partial<Attachment>) {
  return Object.assign(
    {
      title: 'cat pictures',
      description: 'cat pictures are the worst',
      url: 'https://api.imgur.com/3/image/1',
    },
    data,
  );
}

function givenFriendshipData(data?: Partial<Friendship>) {
  return Object.assign({}, data);
}

export async function givenTodoList(
  todoListRepo: TodoListRepository,
  data?: Partial<TodoList>,
) {
  return todoListRepo.create(givenTodoListData(data));
}

export function givenTodoLists(
  todoListRepo: TodoListRepository,
  data: Array<Partial<TodoList>> = [],
): Array<Promise<TodoList>> {
  return data.map(todoList => givenTodoList(todoListRepo, todoList));
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

export async function givenUser(
  userRepository: UserRepository,
  data?: Partial<User>,
) {
  return userRepository.create(givenUserData(data));
}

export async function givenFriendship(
  friendshipRepo: FriendshipRepository,
  data?: Partial<Friendship>,
) {
  return friendshipRepo.create(givenFriendshipData(data));
}

export async function givenAttachment(
  attachmentRepo: AttachmentRepository,
  data?: Partial<Attachment>,
) {
  return attachmentRepo.create(givenAttachmentData(data));
}
