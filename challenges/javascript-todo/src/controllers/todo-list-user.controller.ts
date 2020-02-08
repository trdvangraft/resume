import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {TodoList, User} from '../models';
import {TodoListRepository} from '../repositories';

export class TodoListUserController {
  constructor(
    @repository(TodoListRepository)
    public todoListRepository: TodoListRepository,
  ) {}

  @get('/todo-lists/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to TodoList',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof TodoList.prototype.id,
  ): Promise<User> {
    return this.todoListRepository.user(id);
  }
}
