import {model, property, Model} from '@loopback/repository';
// import {User} from './user.model';

@model()
export class NewUserRequest extends Model {
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
    default: Date.now(),
  })
  joinDate: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  roles?: string[];

  @property({
    type: 'string',
    required: true,
  })
  password: string;
}
