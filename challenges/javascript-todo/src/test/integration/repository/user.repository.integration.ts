import {
  TodoRepository,
  TodoListRepository,
  UserRepository,
  FriendshipRepository,
} from '../../../repositories';
import {
  givenEmptyDatabase,
  givenUser,
  givenTodoList,
  givenTodo,
  init,
  givenFriendship,
} from '../../helpers/database.helpers';
import {expect, toJSON} from '@loopback/testlab';

describe('UserRepository (Integration)', () => {
  let todoRepo: TodoRepository;
  let todoListRepo: TodoListRepository;
  let userRepo: UserRepository;
  let friendRepo: FriendshipRepository;

  beforeEach(givenEmptyDatabase);
  beforeEach(async () => {
    const repos = await init();
    todoRepo = repos.todoRepo;
    todoListRepo = repos.todoListRepo;
    userRepo = repos.userRepo;
    friendRepo = repos.friendshipRepo;
  });

  describe('create()', () => {
    it('create a basic user', async () => {
      const user = await givenUser(userRepo);

      const response = await userRepo.find();

      expect(toJSON(response)).to.deepEqual([{...toJSON(user)}]);
    });

    it('creates a user with a basic todo list', async () => {
      const user = await givenUser(userRepo);
      await givenTodoList(todoListRepo, {userId: user.id});

      const response = await userRepo.find({
        include: [{relation: 'todoLists'}],
      });

      expect(response).to.have.length(1);
    });

    it('creates user that are friends', async () => {
      const userA = await givenUser(userRepo, {username: 'Tijmen'});
      const userB = await givenUser(userRepo, {
        username: 'Jeroen',
        firstname: 'Jeroen',
      });
      const friendAB = await givenFriendship(friendRepo, {
        userId: userA.id,
        friendId: userB.id,
      });
      const friendBA = await givenFriendship(friendRepo, {
        userId: userB.id,
        friendId: userA.id,
      });

      const response = await userRepo.find({
        include: [
          {
            relation: 'friendships',
            scope: {
              include: [
                {
                  relation: 'friend',
                },
                {relation: 'user'},
              ],
            },
          },
        ],
      });

      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(userA),
          friendships: [
            {
              ...toJSON(friendAB),
              friend: {
                ...toJSON(userB),
              },
              user: {
                ...toJSON(userA),
              },
            },
          ],
        },
        {
          ...toJSON(userB),
          friendships: [
            {
              ...toJSON(friendBA),
              friend: {
                ...toJSON(userA),
              },
              user: {
                ...toJSON(userB),
              },
            },
          ],
        },
      ]);
    });
  });

  describe('read()', () => {
    it('reads all basic fields of users', async () => {
      const user = await givenUser(userRepo);

      const response = await userRepo.find();

      expect(toJSON(response)).to.deepEqual([{...toJSON(user)}]);
    });

    it('resolves todolists', async () => {
      const user = await givenUser(userRepo);
      const list = await givenTodoList(todoListRepo, {userId: user.id});

      const response = await userRepo.find({
        include: [{relation: 'todoLists'}],
      });

      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(user),
          todoLists: [toJSON(list)],
        },
      ]);
    });

    it('resolves todolists with todos and attachments ', async () => {
      const user = await givenUser(userRepo);
      const list = await givenTodoList(todoListRepo, {userId: user.id});
      const todo = await givenTodo(todoRepo, {todoListId: list.id});

      const response = await userRepo.find({
        include: [
          {
            relation: 'todoLists',
            scope: {
              include: [
                {
                  relation: 'todos',
                },
              ],
            },
          },
        ],
      });

      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(user),
          todoLists: [
            {
              ...toJSON(list),
              todos: [{...toJSON(todo)}],
            },
          ],
        },
      ]);
    });

    it('finds users based on a query', async () => {
      const userA = await givenUser(userRepo, {username: 'pietjepuck'});
      await givenUser(userRepo, {username: 'sarah'});
      const userC = await givenUser(userRepo, {firstname: 'tijmen'});

      const response = await userRepo.find({
        where: {
          or: [{username: 'pietjepuck'}, {firstname: 'tijmen'}],
        },
      });

      expect(toJSON(response)).to.deepEqual([
        {...toJSON(userA)},
        {...toJSON(userC)},
      ]);
    });

    it('finds users based on their id', async () => {
      const userA = await givenUser(userRepo, {username: 'pietjepuck'});

      const response = await userRepo.findById(userA.id);

      expect(toJSON(response)).to.deepEqual({...toJSON(userA)});
    });
  });

  describe('update()', () => {
    it('updates a basic fields', async () => {
      const userA = await givenUser(userRepo);
      const userB = await givenUser(userRepo, {username: 'jeroen'});

      const count = await userRepo.updateAll({username: 'sarah'});
      const response = await userRepo.find();

      expect(count.count).to.eql(2);
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(userA),
          username: 'sarah',
        },
        {
          ...toJSON(userB),
          username: 'sarah',
        },
      ]);
    });

    it('updates the todolists ids', async () => {
      const userA = await givenUser(userRepo);

      await userRepo.updateById(userA.id, {username: 'sarah'});
      const response = await userRepo.findById(userA.id);

      expect(toJSON(response)).to.deepEqual({
        ...toJSON(userA),
        username: 'sarah',
      });
    });
  });

  describe('delete()', () => {
    it('deletes a basic user', async () => {
      await givenUser(userRepo);

      const count = await userRepo.deleteAll();
      const response = await userRepo.find();

      expect(count.count).to.eql(1);
      expect(response).to.have.length(0);
    });

    it('delets a user with empty todolists', async () => {
      const user = await givenUser(userRepo);
      await givenTodoList(todoListRepo, {userId: user.getId()});

      const count = await userRepo.deleteAll();
      const response = await todoListRepo.find();

      expect(count.count).to.eql(1);
      expect(response).to.have.length(0);
    });

    it('deletes a user with used todolists', async () => {
      const user = await givenUser(userRepo);
      const list = await givenTodoList(todoListRepo, {userId: user.getId()});
      await givenTodo(todoRepo, {todoListId: list.id});

      const count = await userRepo.deleteAll();
      const lists = await todoListRepo.find();
      const todos = await todoRepo.find();

      expect(count.count).to.eql(1);
      expect(lists).to.have.length(0);
      expect(todos).to.have.length(0);
    });

    it('deletes used todolists based on user id', async () => {
      const user = await givenUser(userRepo);
      const list = await givenTodoList(todoListRepo, {userId: user.getId()});
      await givenTodo(todoRepo, {todoListId: list.id});

      await userRepo.deleteById(user.id);
      const lists = await todoListRepo.find();
      const todos = await todoRepo.find();

      expect(lists).to.have.length(0);
      expect(todos).to.have.length(0);
    });

    it('delete all with where clause', async () => {
      const userA = await givenUser(userRepo, {username: 'sarah'});
      const userB = await givenUser(userRepo, {username: 'jeroen'});

      const listA = await givenTodoList(todoListRepo, {userId: userA.id});
      const listB = await givenTodoList(todoListRepo, {userId: userB.id});

      await givenTodo(todoRepo, {title: 'studying', todoListId: listA.id});
      await givenTodo(todoRepo, {title: 'more studying', todoListId: listA.id});
      const todo = await givenTodo(todoRepo, {todoListId: listB.id});

      const count = await userRepo.deleteAll({username: 'sarah'});
      const lists = await todoListRepo.find();
      const todos = await todoRepo.find();

      expect(count.count).to.eql(1);
      expect(toJSON(lists)).to.deepEqual([
        {
          ...toJSON(listB),
        },
      ]);
      expect(toJSON(todos)).to.deepEqual([
        {
          ...toJSON(todo),
        },
      ]);
    });
  });
});
