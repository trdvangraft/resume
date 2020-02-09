/* eslint-disable @typescript-eslint/ban-ts-ignore */
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
  Condition,
  AndClause,
  OrClause,
  HasOneRepositoryFactory,
  Count,
} from '@loopback/repository';
import {
  User,
  UserRelations,
  TodoList,
  Friendship,
  UserCredentials,
} from '../models';
import {TodoListDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {TodoListRepository} from './todo-list.repository';
import {FriendshipRepository} from './friendship.repository';
import {UserCredentialsRepository} from './user-credentials.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly todoLists: HasManyRepositoryFactory<
    TodoList,
    typeof User.prototype.id
  >;

  public readonly friendships: HasManyRepositoryFactory<
    Friendship,
    typeof User.prototype.id
  >;

  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.TodoListDB') dataSource: TodoListDbDataSource,
    @repository.getter('TodoListRepository')
    protected todoListRepositoryGetter: Getter<TodoListRepository>,
    @repository.getter('FriendshipRepository')
    protected friendshipRepositoryGetter: Getter<FriendshipRepository>,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<
      UserCredentialsRepository
    >,
  ) {
    super(User, dataSource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
    this.friendships = this.createHasManyRepositoryFactoryFor(
      'friendships',
      friendshipRepositoryGetter,
    );
    this.registerInclusionResolver(
      'friendships',
      this.friendships.inclusionResolver,
    );
    this.todoLists = this.createHasManyRepositoryFactoryFor(
      'todoLists',
      todoListRepositoryGetter,
    );
    this.registerInclusionResolver(
      'todoLists',
      this.todoLists.inclusionResolver,
    );
  }

  async addFriend(from: string, to?: string) {
    User.definition.addSetting('allowExtendedOperators', true);
    // @ts-ignore
    return super.updateById(from, {$push: {friends: to}});
  }

  async deleteAll(
    query?: Condition<User> | AndClause<User> | OrClause<User>,
  ): Promise<Count> {
    const todoListRepository = await this.todoListRepositoryGetter();
    const count = await super.deleteAll(query);
    await super
      .find({
        fields: {
          id: true,
        },
      })
      .then(todoLists => {
        const todoIds = todoLists.map(el => el.getId());
        return Promise.all([
          todoListRepository.deleteAll({userId: {nin: todoIds}}),
        ]);
      });

    return count;
  }

  async deleteById(id?: string) {
    const todoListRepository = await this.todoListRepositoryGetter();
    await todoListRepository.deleteAll({userId: id});
    await super.deleteById(id);
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
