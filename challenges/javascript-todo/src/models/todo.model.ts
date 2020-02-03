import {Entity, model, property, belongsTo} from '@loopback/repository';
import {TodoList, TodoListWithRelations} from './todo-list.model';

@model({settings: {strictObjectIDCoercion: true}})
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

  @belongsTo(() => TodoList)
  todoListId: string;

  constructor(data?: Partial<Todo>) {
    super(data);
  }
}

export interface TodoRelations {
  // describe navigational properties here
  todoList?: TodoListWithRelations
}

export type TodoWithRelations = Todo & TodoRelations;
