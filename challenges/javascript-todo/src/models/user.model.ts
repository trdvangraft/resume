import {
  Entity,
  model,
  property,
  hasMany,
  belongsTo,
  hasOne,
} from '@loopback/repository';
import {TodoList, TodoListWithRelations} from './todo-list.model';
import {Friendship, FriendshipWithRelations} from './friendship.model';
import {UserCredentials} from './user-credentials.model';

@model({
  settings: {
    hiddenProperties: ['password'],
    mongodb: {
      allowExtendedOperators: true,
    },
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class User extends Entity {
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
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  firstname: string;

  @property({
    type: 'string',
    required: true,
  })
  lastname: string;

  @property({
    type: 'date',
    required: true,
    default: Date.now(),
  })
  joinDate: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  roles?: string[];

  @hasMany(() => TodoList)
  todoLists: TodoList[];

  @hasMany(() => Friendship)
  friendships: Friendship[];

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
  todoLists?: TodoListWithRelations[];
  friendships?: FriendshipWithRelations[];
}

export type UserWithRelations = User & UserRelations;
