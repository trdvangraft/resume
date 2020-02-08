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
  Friendship,
} from '../models';
import {UserRepository} from '../repositories';

export class UserFriendshipController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/friendships', {
    responses: {
      '200': {
        description: 'Array of User has many Friendship',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Friendship)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Friendship>,
  ): Promise<Friendship[]> {
    return this.userRepository.friendships(id).find(filter);
  }

  @post('/users/{id}/friendships', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Friendship)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Friendship, {
            title: 'NewFriendshipInUser',
            exclude: ['friendshipId'],
            optional: ['userId']
          }),
        },
      },
    }) friendship: Omit<Friendship, 'friendshipId'>,
  ): Promise<Friendship> {
    return this.userRepository.friendships(id).create(friendship);
  }

  @patch('/users/{id}/friendships', {
    responses: {
      '200': {
        description: 'User.Friendship PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Friendship, {partial: true}),
        },
      },
    })
    friendship: Partial<Friendship>,
    @param.query.object('where', getWhereSchemaFor(Friendship)) where?: Where<Friendship>,
  ): Promise<Count> {
    return this.userRepository.friendships(id).patch(friendship, where);
  }

  @del('/users/{id}/friendships', {
    responses: {
      '200': {
        description: 'User.Friendship DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Friendship)) where?: Where<Friendship>,
  ): Promise<Count> {
    return this.userRepository.friendships(id).delete(where);
  }
}
