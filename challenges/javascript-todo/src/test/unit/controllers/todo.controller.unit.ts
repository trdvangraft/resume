import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {TodoRepository} from '../../../repositories';
import {TodoController} from '../../../controllers';
import {Todo} from '../../../models';
import {givenTodoData} from '../../helpers/database.helpers';
import {Count} from '@loopback/repository';

describe('TodoController (unit)', () => {
  let repository: StubbedInstanceWithSinonAccessor<TodoRepository>;
  beforeEach(givenStubbedRepository);

  describe('create()', () => {
    it('creates a new todo', async () => {
      const todo = new Todo({
        title: 'todo 1',
        description: 'description 1',
        status: 'Pending',
        color: '#ff00ff',
      });
      const controller = new TodoController(repository);
      repository.stubs.create.resolves(todo);

      const createdTodo = await controller.create(todo);

      expect(createdTodo).to.eql(todo);

      sinon.assert.calledWith(repository.stubs.create, todo);
    });

    it('should have all required fields', async () => {
      const todo = givenTodoData({
        title: 'todo 1',
      }) as Todo;

      const controller = new TodoController(repository);
      repository.stubs.create.rejects({status: 400});

      controller.create(todo).catch(err => {
        expect(err).to.eql({
          status: 400,
        });
      });

      sinon.assert.calledWith(repository.stubs.create, todo);
    });
  });

  describe('read()', () => {
    it('gets a list of todos', async () => {
      const todo = givenTodoData({title: 'title'}) as Todo;
      const controller = new TodoController(repository);
      repository.stubs.find.resolves([todo]);

      const todos = await controller.find();

      expect(todos).containEql(todo);
      sinon.assert.called(repository.stubs.find);
    });

    it('gets a empty todolist', async () => {
      const controller = new TodoController(repository);
      repository.stubs.find.resolves([]);

      const todos = await controller.find();

      expect(todos).to.have.length(0);
      sinon.assert.called(repository.stubs.find);
    });

    it('gets todos based on their title', async () => {
      const controller = new TodoController(repository);
      repository.stubs.find.resolves(givenTodoList([{title: 'todo 1'}]));

      const todos = await controller.find({where: {title: 'todo 1'}});

      expect(todos)
        .to.containEql(new Todo({title: 'todo 1'}))
        .and.to.have.length(1);
      sinon.assert.calledWith(repository.stubs.find, {
        where: {title: 'todo 1'},
      });
    });

    it('gets an empty todolist if there is no valid query', async () => {
      const controller = new TodoController(repository);
      repository.stubs.find.resolves([]);

      const todos = await controller.find({where: {title: 'todo 2'}});

      expect(todos).to.have.length(0);

      sinon.assert.calledWith(repository.stubs.find, {
        where: {title: 'todo 2'},
      });
    });
  });

  describe('update()', () => {
    it('should be possible to update todos by id', async () => {
      const newTodo = givenTodoData({id: '1', title: 'new title'}) as Todo;

      const controller = new TodoController(repository);
      repository.stubs.updateById.withArgs('1', newTodo).resolves();

      const result = await controller.updateById('1', newTodo);

      expect(result).to.not.throw();

      sinon.assert.calledWith(repository.stubs.updateById, '1', newTodo);
    });

    it('should be update by where query', async () => {
      const newTodo = givenTodoData({title: 'new title'}) as Todo;
      const count = {count: 1} as Count;

      const controller = new TodoController(repository);
      repository.stubs.updateAll
        .withArgs(newTodo, {title: 'todo 1'})
        .resolves(count);

      const result = await controller.updateAll(newTodo, {title: 'todo 1'});

      expect(result).to.be.eql(count);

      sinon.assert.calledWith(repository.stubs.updateAll, newTodo, {
        title: 'todo 1',
      });
    });

    it('should not be able to delete required fields', async () => {
      const controller = new TodoController(repository);

      repository.stubs.updateAll.rejects({status: 400});
      controller
        .updateAll(new Todo({title: 'not valid'}), {title: 'not valid'})
        .catch(err => expect(err).to.eql({status: 400}));

      sinon.assert.calledWith(
        repository.stubs.updateAll,
        new Todo({title: 'not valid'}),
        {title: 'not valid'},
      );
    });
  });

  describe('delete()', () => {
    it('should be possible to delete by id', async () => {
      const controller = new TodoController(repository);

      repository.stubs.deleteById.withArgs('1').resolves();
      const result = await controller.deleteById('1');

      expect(result).to.not.throw();
      sinon.assert.calledWith(repository.stubs.deleteById, '1');
    });
  });

  function givenStubbedRepository() {
    repository = createStubInstance(TodoRepository);
  }

  function givenTodoList(data: Array<Partial<Todo>>) {
    return data.map(el => new Todo(el));
  }
});
