/* eslint-disable @typescript-eslint/ban-ts-ignore */
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
  Condition,
  BelongsToAccessor,
  Count,
} from '@loopback/repository';
import {TodoList, TodoListRelations, Todo, User, Attachment} from '../models';
import {TodoListDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {TodoRepository} from './todo.repository';
import {UserRepository} from './user.repository';
import {AttachmentRepository} from './attachment.repository';

export class TodoListRepository extends DefaultCrudRepository<
  TodoList,
  typeof TodoList.prototype.id,
  TodoListRelations
> {
  public readonly todos: HasManyRepositoryFactory<
    Todo,
    typeof TodoList.prototype.id
  >;

  public readonly user: BelongsToAccessor<User, typeof TodoList.prototype.id>;

  public readonly attachments: HasManyRepositoryFactory<
    Attachment,
    typeof TodoList.prototype.id
  >;

  constructor(
    @inject('datasources.TodoListDB') dataSource: TodoListDbDataSource,
    @repository.getter('TodoRepository')
    protected todoRepositoryGetter: Getter<TodoRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('AttachmentRepository')
    protected attachmentRepositoryGetter: Getter<AttachmentRepository>,
  ) {
    super(TodoList, dataSource);
    this.attachments = this.createHasManyRepositoryFactoryFor(
      'attachments',
      attachmentRepositoryGetter,
    );
    this.registerInclusionResolver(
      'attachments',
      this.attachments.inclusionResolver,
    );
    this.todos = this.createHasManyRepositoryFactoryFor(
      'todos',
      todoRepositoryGetter,
    );
    this.registerInclusionResolver('todos', this.todos.inclusionResolver);

    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }

  async addTag(id?: string, tag?: string) {
    // @ts-ignore
    return super.updateById(id, {$push: {tags: tag}});
  }

  async removeTag(id?: string, tag?: string) {}

  async updateTag(id?: string, oldTag?: string, newTag?: string) {}

  async deleteById(id?: string) {
    const todoRepository = await this.todoRepositoryGetter();
    await todoRepository.deleteAll({todoListId: id});
    await super.deleteById(id);
  }

  async deleteAll(query?: Condition<TodoList>): Promise<Count> {
    const todoRepository = await this.todoRepositoryGetter();
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
          todoRepository.deleteAll({todoListId: {nin: todoIds}}),
        ]);
      });

    return count;
  }
}
