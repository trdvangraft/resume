/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  givenEmptyDatabase,
  givenTodo,
  givenTodoData,
  init,
} from '../../helpers/database.helpers';
import {expect, toJSON} from '@loopback/testlab';
import {TodoRepository} from '../../../repositories';

describe('TodoRepository (Integration)', () => {
  let todoRepo: TodoRepository;
  beforeEach(givenEmptyDatabase);

  beforeEach(async () => {
    const repos = await init();
    todoRepo = repos.todoRepo;
  });

  describe('create()', () => {
    it('creates a basic instance', async () => {
      const todo = await givenTodo(todoRepo);
      const response = await todoRepo.find();
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(todo),
        },
      ]);
    });

    it('creates multiple instances', async () => {
      const todos = await todoRepo.createAll([
        givenTodoData({title: 'todoA'}),
        givenTodoData({title: 'todoB'}),
        givenTodoData({title: 'todoC'}),
      ]);

      const response = await todoRepo.find();
      expect(toJSON(response)).to.deepEqual([...toJSON(todos)]);
    });
  });

  describe('read()', () => {
    it('finds the collection', async () => {
      const todoA = await givenTodo(todoRepo, {title: 'todoA'});
      const todoB = await givenTodo(todoRepo, {title: 'todoB'});

      const response = await todoRepo.find();
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(todoA),
        },
        {
          ...toJSON(todoB),
        },
      ]);
    });

    it('finds by id', async () => {
      const todoA = await givenTodo(todoRepo);

      const response = await todoRepo.findById(todoA.id);
      expect(toJSON(response)).to.deepEqual({
        ...toJSON(todoA),
      });
    });

    it('finds by filter', async () => {
      await givenTodo(todoRepo, {title: 'todoA'});
      const todoB = await givenTodo(todoRepo, {
        title: 'todoB',
        description: 'awesome description',
      });
      const todoC = await givenTodo(todoRepo, {
        title: 'todoC',
        description: 'awesome description',
      });

      const response = await todoRepo.find({
        where: {description: 'awesome description'},
      });
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(todoB),
        },
        {
          ...toJSON(todoC),
        },
      ]);
    });
  });

  describe('update()', () => {
    it('updates by id', async () => {
      const todoA = await givenTodo(todoRepo);
      await todoRepo.updateById(todoA.id, {title: 'changed todo'});

      const response = await todoRepo.find();
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(todoA),
          title: 'changed todo',
        },
      ]);
    });

    it('updates multiple with query', async () => {
      const todoA = await givenTodo(todoRepo, {description: 'awesome'});
      const todoB = await givenTodo(todoRepo, {description: 'awesome'});

      const count = await todoRepo.updateAll(
        givenTodoData({description: 'not awesome'}),
        {description: 'awesome'},
      );

      expect(count.count).to.be.eql(2);

      const response = await todoRepo.find();
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(todoA),
          description: 'not awesome',
        },
        {
          ...toJSON(todoB),
          description: 'not awesome',
        },
      ]);
    });
  });

  describe('delete()', () => {
    it('deletes by id', async () => {
      const todoA = await givenTodo(todoRepo);
      const todoB = await givenTodo(todoRepo);

      await todoRepo.deleteById(todoB.id);

      const response = await todoRepo.find();
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(todoA),
        },
      ]);
    });

    it('deletes with query', async () => {
      await givenTodo(todoRepo, {description: 'awesome'});
      await givenTodo(todoRepo, {description: 'awesome'});

      const count = await todoRepo.deleteAll({description: 'awesome'});

      const response = await todoRepo.find();
      expect(response).to.have.length(0);
      expect(count.count).to.eql(2);
    });
  });
});
