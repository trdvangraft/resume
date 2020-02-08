import {
  Entity,
  model,
  property,
  hasMany,
  belongsTo,
} from '@loopback/repository';
import {Todo, TodoWithRelations} from './todo.model';
import {User, UserWithRelations} from './user.model';
import {Attachment} from './attachment.model';

@model({
  name: 'Todo list',
  settings: {
    description: 'Todo list entity, it contains container for todos',
    scopes: {
      newest: {limit: 1, order: 'creationDate'},
    },
    mongodb: {
      allowExtendedOperators: true,
    },
  },
})
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
    type: 'date',
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

  @belongsTo(() => User)
  userId: string;

  @hasMany(() => Attachment)
  attachments: Attachment[];

  constructor(data?: Partial<TodoList>) {
    super(data);
  }
}

export interface TodoListRelations {
  todos?: TodoWithRelations[];
  userId?: UserWithRelations;
}

export type TodoListWithRelations = TodoList & TodoListRelations;
