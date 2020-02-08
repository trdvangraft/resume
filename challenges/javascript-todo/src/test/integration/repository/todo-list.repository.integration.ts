import {
  givenEmptyDatabase,
  givenTodoList,
  givenTodo,
  givenTodoListData,
  givenTodoData,
  init,
  givenAttachment,
} from '../../helpers/database.helpers';
import {
  TodoListRepository,
  TodoRepository,
  AttachmentRepository,
} from '../../../repositories';
import {expect, toJSON} from '@loopback/testlab';

describe('TodoListRepository (Integration)', () => {
  let todoRepo: TodoRepository;
  let todoListRepo: TodoListRepository;
  let attachmentRepo: AttachmentRepository;

  beforeEach(givenEmptyDatabase);
  beforeEach(async () => {
    const repos = await init();
    todoRepo = repos.todoRepo;
    todoListRepo = repos.todoListRepo;
    attachmentRepo = repos.attachmentRepo;
  });

  // TODO: convert this to have proper date representation
  describe('create()', () => {
    it('creates an empty list', async () => {
      const list = await givenTodoList(todoListRepo);

      const response = await todoListRepo.find();

      expect(toJSON(response)).to.deepEqual([{...toJSON(list)}]);
    });

    it('adds a todo and attachment to a todolist', async () => {
      const list = await givenTodoList(todoListRepo);
      const todos = [
        await givenTodo(todoRepo, {todoListId: list.id}),
        await givenTodo(todoRepo, {
          title: 'additional todo',
          todoListId: list.id,
        }),
      ];
      const attachment = await givenAttachment(attachmentRepo, {
        todoListId: list.id,
      });

      const response = await todoListRepo.find({
        include: [{relation: 'todos'}, {relation: 'attachments'}],
      });

      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(list),
          todos: toJSON(todos),
          attachments: [toJSON(attachment)],
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

    it('adds a new tag and updates it', async () => {
      const list = await givenTodoList(todoListRepo);

      await todoListRepo.addTag(list.id, 'new tag');
      await todoListRepo.addTag(list.id, 'another tag');
      await todoListRepo.updateTag(list.id, 'another tag', 'the best tag');

      const response = await todoListRepo.findById(list.id);

      expect(toJSON(response)).to.deepEqual({
        ...toJSON(list),
        tags: [...list.tags, 'new tag', 'the best tag'],
      });
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
    it('deletes a todolist based on where query and all its todos', async () => {
      const listA = await givenTodoList(todoListRepo, {
        title: 'list-a',
        description: 'example todolist',
      });
      const listB = await givenTodoList(todoListRepo, {title: 'list-b'});
      const listC = await givenTodoList(todoListRepo, {
        title: 'list-c',
        description: 'example todolist',
      });
      await givenTodo(todoRepo, {todoListId: listA.id});
      await givenTodo(todoRepo, {todoListId: listB.id});
      await givenTodo(todoRepo, {todoListId: listC.id});

      expect(await todoRepo.find()).to.have.length(3);

      // TODO create deletes all with this
      await todoListRepo.deleteAll({description: 'example todolist'});

      expect(await todoListRepo.find()).to.have.length(1);
      expect(await todoRepo.find()).to.have.length(1);
    });

    it('deletes all todos belonging to a list based on the list id', async () => {
      const listA = await givenTodoList(todoListRepo, {title: 'list-a'});
      const listB = await givenTodoList(todoListRepo, {title: 'list-b'});
      await givenTodo(todoRepo, {
        title: 'additional todo',
        todoListId: listA.id,
      });

      await givenTodo(todoRepo, {todoListId: listB.id});

      expect(await todoRepo.find()).to.have.length(2);

      await todoListRepo.deleteById(listA.id);

      expect(await todoListRepo.find()).to.have.length(1);
      expect(await todoRepo.find()).to.have.length(1);
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
});
