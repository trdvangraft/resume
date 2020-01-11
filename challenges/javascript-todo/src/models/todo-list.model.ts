import {Entity, model, property, hasMany} from '@loopback/repository';
import {Todo} from './todo.model';

@model()
export class TodoList extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    default: 'title',
  })
  title: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'object',
    required: true,
  })
  creationDate: object;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
    default: [],
  })
  tags: string[];

  @hasMany(() => Todo)
  todos: Todo[];

  constructor(data?: Partial<TodoList>) {
    super(data);
  }
}

export interface TodoListRelations {
  // describe navigational properties here
}

export type TodoListWithRelations = TodoList & TodoListRelations;
