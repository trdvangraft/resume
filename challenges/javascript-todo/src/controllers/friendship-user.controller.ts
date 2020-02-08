import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Friendship,
  User,
} from '../models';
import {FriendshipRepository} from '../repositories';

export class FriendshipUserController {
  constructor(
    @repository(FriendshipRepository)
    public friendshipRepository: FriendshipRepository,
  ) { }

  @get('/friendships/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Friendship',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Friendship.prototype.friendshipId,
  ): Promise<User> {
    return this.friendshipRepository.user(id);
  }
}
