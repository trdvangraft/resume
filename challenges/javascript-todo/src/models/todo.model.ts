import {Entity, model, property} from '@loopback/repository';

@model({ settings: { strictObjectIDCoercion: true } })
export class Todo extends Entity {
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
  title: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
    required: true,
    default: 'Pending',
  })
  status: string;

  @property({
    type: 'string',
    default: '#34b7eb',
  })
  color?: string;

  @property({
    type: 'string',
  })
  todoListId?: string;

  constructor(data?: Partial<Todo>) {
    super(data);
  }
}

export interface TodoRelations {
  // describe navigational properties here
}

export type TodoWithRelations = Todo & TodoRelations;
