import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {Friendship, FriendshipRelations, User} from '../models';
import {TodoListDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class FriendshipRepository extends DefaultCrudRepository<
  Friendship,
  typeof Friendship.prototype.friendshipId,
  FriendshipRelations
> {
  public readonly user: BelongsToAccessor<
    User,
    typeof Friendship.prototype.friendshipId
  >;

  public readonly friend: BelongsToAccessor<
    User,
    typeof Friendship.prototype.friendshipId
  >;

  constructor(
    @inject('datasources.TodoListDB') dataSource: TodoListDbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Friendship, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.friend = this.createBelongsToAccessorFor(
      'friend',
      userRepositoryGetter,
    );

    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.registerInclusionResolver('friend', this.friend.inclusionResolver);
  }
}
