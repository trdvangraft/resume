import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Attachment, AttachmentRelations, TodoList} from '../models';
import {TodoListDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {TodoListRepository} from './todo-list.repository';

export class AttachmentRepository extends DefaultCrudRepository<
  Attachment,
  typeof Attachment.prototype.id,
  AttachmentRelations
> {

  public readonly todoList: BelongsToAccessor<TodoList, typeof Attachment.prototype.id>;

  constructor(
    @inject('datasources.TodoListDB') dataSource: TodoListDbDataSource, @repository.getter('TodoListRepository') protected todoListRepositoryGetter: Getter<TodoListRepository>,
  ) {
    super(Attachment, dataSource);
    this.todoList = this.createBelongsToAccessorFor('todoList', todoListRepositoryGetter,);
  }
}
