/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  givenEmptyDatabase,
  givenTodo,
  givenTodos,
  givenTodoData,
  init,
} from '../../helpers/database.helpers';
import {expect} from '@loopback/testlab';
import {TodoController} from '../../../controllers';
import {TodoRepository} from '../../../repositories';
import {Todo} from '../../../models';
import {todoConverter} from '../../helpers/types.helpers';

describe('TodoController (integration)', () => {
  beforeEach(givenEmptyDatabase);

  let todoRepo: TodoRepository;

  before(async () => {
    const repos = await init();
    todoRepo = repos.todoRepo;
  });

  describe('create()', () => {
    it('creates new todo', async () => {
      const todo = givenTodoData() as Todo;
      const controller = new TodoController(todoRepo);

      // convertBsonToString<Todo>()
      const result = await controller.create(todo);

      expect(todoConverter(result)).to.eql(todo);
    });
  });

  describe('read()', () => {
    it('finds new todo', async () => {
      const todos = await initTodos();
      const controller = new TodoController(todoRepo);

      const result = await controller.find();

      expect(result).to.containDeep(todos);
    });

    it('filters todos', async () => {
      const todos = await initTodos([{title: 'c-todo'}]);
      const controller = new TodoController(todoRepo);

      const result = await controller.find({where: {title: 'c-todo'}});

      expect(result)
        .to.eql(todos.filter(el => el.title === 'c-todo'))
        .and.to.have.length(1);
    });

    it('returns empty list if no match', async () => {
      await initTodos();
      const controller = new TodoController(todoRepo);

      const result = await controller.find({where: {title: 'c-todo'}});

      expect(result)
        .to.eql([])
        .to.have.length(0);
    });

    it('it returns an empty list on a empty db', async () => {
      const controller = new TodoController(todoRepo);

      const result = await controller.find({where: {title: 'c-todo'}});

      expect(result)
        .to.eql([])
        .to.have.length(0);
    });
  });

  describe('update()', () => {
    it('update by id', async () => {
      const controller = new TodoController(todoRepo);
      const todos = await initTodos([{title: 'c-todo'}]);

      const todo = todos.filter(el => el.title === 'c-todo')[0];
      todo.title = 'd-todo';

      await controller.updateById(todo.id!, todo);
      const result = await controller.findById(todo.id!);

      expect(todoConverter(result)).to.eql(todoConverter(todo));
    });

    it('update by where', async () => {
      const controller = new TodoController(todoRepo);
      await initTodos([{description: 'tag'}, {description: 'tag'}]);

      const todo = givenTodoData() as Todo;

      const count = await controller.updateAll(todo, {description: 'tag'});
      const result = await controller.find({where: {description: 'tag'}});

      expect(count.count).is.eql(2);
      expect(result).to.have.length(0);
    });
  });

  describe('delete()', () => {
    it('delete unexisting todo by id', async () => {
      const controller = new TodoController(todoRepo);

      return controller.deleteById('1').then(
        () => Promise.reject(new Error('Expected rejection')),
        err => expect(err).instanceOf(Error),
      );
    });
  });

  const initTodos = (additionalTodos: Array<Partial<Todo>> = []) => {
    return Promise.all(
      givenTodos(todoRepo, [
        {title: 'a-todo'},
        {title: 'b-todo', description: 'b-description'},
        ...additionalTodos,
      ]),
    );
  };
});
