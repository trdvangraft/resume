import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Attachment,
  TodoList,
} from '../models';
import {AttachmentRepository} from '../repositories';

export class AttachmentTodoListController {
  constructor(
    @repository(AttachmentRepository)
    public attachmentRepository: AttachmentRepository,
  ) { }

  @get('/attachments/{id}/todo-list', {
    responses: {
      '200': {
        description: 'TodoList belonging to Attachment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TodoList)},
          },
        },
      },
    },
  })
  async getTodoList(
    @param.path.string('id') id: typeof Attachment.prototype.id,
  ): Promise<TodoList> {
    return this.attachmentRepository.todoList(id);
  }
}
