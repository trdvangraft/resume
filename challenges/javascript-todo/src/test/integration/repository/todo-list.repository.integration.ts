import {
  givenEmptyDatabase,
  givenTodoList,
  givenTodo,
  givenTodoListData,
  givenTodoData,
} from '../../helpers/database.helpers';
import {TodoListRepository, TodoRepository} from '../../../repositories';
import {testdb} from '../../fixtures/datasources/testdb.datasource';
import {expect, toJSON} from '@loopback/testlab';

describe('TodoListRepository (Integration)', () => {
  let todoRepo: TodoRepository;
  let todoListRepo: TodoListRepository;

  beforeEach(givenEmptyDatabase);
  beforeEach(init);

  // TODO: convert this to have proper date representation
  describe('create()', () => {
    it('creates an empty list', async () => {
      const list = await givenTodoList(todoListRepo);

      const response = await todoListRepo.find();

      expect(toJSON(response)).to.deepEqual([{...toJSON(list)}]);
    });

    it('adds a todo to a todolist', async () => {
      const list = await givenTodoList(todoListRepo);
      const todos = [
        await givenTodo(todoRepo, {todoListId: list.id}),
        await givenTodo(todoRepo, {
          title: 'additional todo',
          todoListId: list.id,
        }),
      ];

      const response = await todoListRepo.find({
        include: [{relation: 'todos'}],
      });

      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(list),
          todos: toJSON(todos),
        },
      ]);
    });
  });

  describe('read()', () => {
    it('returns an empty list if no lists are avaliable', async () => {
      const response = await todoListRepo.find();

      expect(toJSON(response)).to.have.length(0);
    });

    it('returns all the todo lists', async () => {
      const listA = await givenTodoList(todoListRepo, {title: 'list-a'});
      const listB = await givenTodoList(todoListRepo, {title: 'list-b'});

      const response = await todoListRepo.find();
      expect(toJSON(response)).to.have.length(2);
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(listA),
        },
        {
          ...toJSON(listB),
        },
      ]);
    });

    it('find a todo list based on their filter', async () => {
      const listA = await givenTodoList(todoListRepo, {title: 'list-a'});
      await givenTodoList(todoListRepo, {title: 'list-b'});

      const response = await todoListRepo.find({
        where: {
          title: 'list-a',
        },
      });
      expect(toJSON(response)).to.have.length(1);
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(listA),
        },
      ]);
    });

    it('returns an empty list when no filter value', async () => {
      await givenTodoList(todoListRepo, {title: 'list-a'});
      await givenTodoList(todoListRepo, {title: 'list-b'});

      const response = await todoListRepo.find({
        where: {
          title: 'list-c',
        },
      });
      expect(toJSON(response)).to.have.length(0);
    });

    it('finds a list by its id', async () => {
      const listA = await givenTodoList(todoListRepo, {title: 'list-a'});
      await givenTodoList(todoListRepo, {title: 'list-b'});

      const response = await todoListRepo.findById(listA.getId());
      expect(toJSON(response)).to.deepEqual({
        ...toJSON(listA),
      });
    });
  });

  describe('update()', () => {
    it('updated the fields of a todo list', async () => {
      const list = await givenTodoList(todoListRepo);

      await todoListRepo.updateById(
        list.id,
        givenTodoListData({
          title: 'new title',
          creationDate: list.creationDate,
        }),
      );

      const response = await todoListRepo.findById(list.id);
      expect(toJSON(response)).to.deepEqual({
        ...toJSON(list),
        title: 'new title',
      });
    });

    it('update with where query', async () => {
      const list = await givenTodoList(todoListRepo, {title: 'title-c'});
      await givenTodoList(todoListRepo, {title: 'list-a'});

      const count = await todoListRepo.updateAll(
        givenTodoListData({title: 'title-b', creationDate: list.creationDate}),
        {
          title: 'title-c',
        },
      );

      expect(count.count).is.eql(1);

      const response = await todoListRepo.find({where: {title: 'title-b'}});
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(list),
          title: 'title-b',
        },
      ]);
    });

    it('update field of todo', async () => {
      const list = await givenTodoList(todoListRepo);
      let todo = await givenTodo(todoRepo, {
        title: 'additional todo',
        todoListId: list.id,
      });

      await todoRepo.updateById(
        todo.id,
        givenTodoData({title: 'updated-todo-title'}),
      );

      todo = await todoRepo.findById(todo.id);

      const response = await todoListRepo.find({
        include: [{relation: 'todos'}],
      });

      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(list),
          todos: [
            {
              ...toJSON(todo),
              title: 'updated-todo-title',
            },
          ],
        },
      ]);
    });

    it('removes and reassignes todos', async () => {
      const listA = await givenTodoList(todoListRepo, {title: 'list-a'});
      const listB = await givenTodoList(todoListRepo, {title: 'list-b'});
      const todo = await givenTodo(todoRepo, {
        title: 'additional todo',
        todoListId: listA.id,
      });

      let response = await todoListRepo.find({
        include: [{relation: 'todos'}],
      });

      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(listA),
          todos: [toJSON(todo)],
        },
        {
          ...toJSON(listB),
        },
      ]);

      await todoRepo.updateById(
        todo.id,
        givenTodoData({
          title: 'additional todo',
          todoListId: listB.id,
        }),
      );

      response = await todoListRepo.find({
        include: [{relation: 'todos'}],
      });

      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(listA),
        },
        {
          ...toJSON(listB),
          todos: [
            {
              ...toJSON(todo),
              todoListId: toJSON(listB.id!),
            },
          ],
        },
      ]);
    });
  });

  describe('delete()', () => {
    it('deletes a todolist and all its todos', async () => {
      const listA = await givenTodoList(todoListRepo, {title: 'list-a'});
      await givenTodo(todoRepo, {
        title: 'additional todo',
        todoListId: listA.id,
      });

      expect(await todoRepo.find()).to.have.length(1);

      await todoListRepo.deleteById(listA.id);

      expect(await todoListRepo.find()).to.have.length(0);
      expect(await todoRepo.find()).to.have.length(0);
    });

    it('deletes all todos when no filter is given', async () => {
      await givenTodoList(todoListRepo, {title: 'list-a'});
      await givenTodoList(todoListRepo, {title: 'list-b'});
      await givenTodoList(todoListRepo, {title: 'list-c'});

      expect(await todoListRepo.find()).to.have.length(3);

      await todoListRepo.deleteAll();

      expect(await todoListRepo.find()).to.have.length(0);
    });
  });

  function init() {
    todoListRepo = new TodoListRepository(testdb, async () => todoRepo);
    todoRepo = new TodoRepository(testdb, async () => todoListRepo);
  }
});
