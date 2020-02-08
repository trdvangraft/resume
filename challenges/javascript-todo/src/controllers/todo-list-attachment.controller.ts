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
  TodoList,
  Attachment,
} from '../models';
import {TodoListRepository} from '../repositories';

export class TodoListAttachmentController {
  constructor(
    @repository(TodoListRepository) protected todoListRepository: TodoListRepository,
  ) { }

  @get('/todo-lists/{id}/attachments', {
    responses: {
      '200': {
        description: 'Array of TodoList has many Attachment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Attachment)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Attachment>,
  ): Promise<Attachment[]> {
    return this.todoListRepository.attachments(id).find(filter);
  }

  @post('/todo-lists/{id}/attachments', {
    responses: {
      '200': {
        description: 'TodoList model instance',
        content: {'application/json': {schema: getModelSchemaRef(Attachment)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof TodoList.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Attachment, {
            title: 'NewAttachmentInTodoList',
            exclude: ['id'],
            optional: ['todoListId']
          }),
        },
      },
    }) attachment: Omit<Attachment, 'id'>,
  ): Promise<Attachment> {
    return this.todoListRepository.attachments(id).create(attachment);
  }

  @patch('/todo-lists/{id}/attachments', {
    responses: {
      '200': {
        description: 'TodoList.Attachment PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Attachment, {partial: true}),
        },
      },
    })
    attachment: Partial<Attachment>,
    @param.query.object('where', getWhereSchemaFor(Attachment)) where?: Where<Attachment>,
  ): Promise<Count> {
    return this.todoListRepository.attachments(id).patch(attachment, where);
  }

  @del('/todo-lists/{id}/attachments', {
    responses: {
      '200': {
        description: 'TodoList.Attachment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Attachment)) where?: Where<Attachment>,
  ): Promise<Count> {
    return this.todoListRepository.attachments(id).delete(where);
  }
}
