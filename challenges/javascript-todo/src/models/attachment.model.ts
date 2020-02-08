import {Entity, model, property, belongsTo} from '@loopback/repository';
import {TodoList} from './todo-list.model';

@model()
export class Attachment extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  @belongsTo(() => TodoList)
  todoListId: string;

  constructor(data?: Partial<Attachment>) {
    super(data);
  }
}

export interface AttachmentRelations {
  // describe navigational properties here
}

export type AttachmentWithRelations = Attachment & AttachmentRelations;
