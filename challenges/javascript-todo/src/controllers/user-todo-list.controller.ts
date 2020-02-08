import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  TodoList,
} from '../models';
import {UserRepository} from '../repositories';

export class UserTodoListController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/todo-lists', {
    responses: {
      '200': {
        description: 'Array of User has many TodoList',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TodoList)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<TodoList>,
  ): Promise<TodoList[]> {
    return this.userRepository.todoLists(id).find(filter);
  }

  @post('/users/{id}/todo-lists', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(TodoList)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoList, {
            title: 'NewTodoListInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) todoList: Omit<TodoList, 'id'>,
  ): Promise<TodoList> {
    return this.userRepository.todoLists(id).create(todoList);
  }

  @patch('/users/{id}/todo-lists', {
    responses: {
      '200': {
        description: 'User.TodoList PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoList, {partial: true}),
        },
      },
    })
    todoList: Partial<TodoList>,
    @param.query.object('where', getWhereSchemaFor(TodoList)) where?: Where<TodoList>,
  ): Promise<Count> {
    return this.userRepository.todoLists(id).patch(todoList, where);
  }

  @del('/users/{id}/todo-lists', {
    responses: {
      '200': {
        description: 'User.TodoList DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(TodoList)) where?: Where<TodoList>,
  ): Promise<Count> {
    return this.userRepository.todoLists(id).delete(where);
  }
}
