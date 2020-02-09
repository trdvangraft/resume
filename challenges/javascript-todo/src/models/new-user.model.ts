import {
  model,
  property,
} from '@loopback/boot/node_modules/@loopback/repository';

import {User} from '.';

@model()
export class NewUser extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}
