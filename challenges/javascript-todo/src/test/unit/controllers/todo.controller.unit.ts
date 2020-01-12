import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {TodoRepository} from '../../../repositories';
import {TodoController} from '../../../controllers';
import {Todo} from '../../../models';

describe('TodoController (unit)', () => {
  let repository: StubbedInstanceWithSinonAccessor<TodoRepository>;
  beforeEach(givenStubbedRepository);

  describe('create()', () => {
    it('creates a new todo', async () => {});
  });

  describe('get()', () => {
    it('gets a list of todos', async () => {
      const todo = new Todo({title: 'title'});
      const controller = new TodoController(repository);
      repository.stubs.find.resolves([todo]);

      const todos = await controller.find();

      expect(todos).containEql(todo);
      sinon.assert.called(repository.stubs.find);
    });
  });

  function givenStubbedRepository() {
    repository = createStubInstance(TodoRepository);
  }
});
