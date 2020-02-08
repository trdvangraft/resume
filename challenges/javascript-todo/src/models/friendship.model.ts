import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User, UserWithRelations} from './user.model';

@model()
export class Friendship extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  friendshipId?: string;

  @property({
    type: 'date',
    default: Date.now(),
  })
  startDate?: string;

  @belongsTo(() => User)
  userId: string;

  @belongsTo(() => User)
  friendId: string;

  constructor(data?: Partial<Friendship>) {
    super(data);
  }
}

export interface FriendshipRelations {
  // describe navigational properties here
  userId?: UserWithRelations;
  friendId?: UserWithRelations;
}

export type FriendshipWithRelations = Friendship & FriendshipRelations;
