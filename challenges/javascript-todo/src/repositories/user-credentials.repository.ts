import {DefaultCrudRepository} from '@loopback/repository';
import {UserCredentials, UserCredentialsRelations} from '../models';
import {TodoListDbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserCredentialsRepository extends DefaultCrudRepository<
  UserCredentials,
  typeof UserCredentials.prototype.id,
  UserCredentialsRelations
> {
  constructor(
    @inject('datasources.TodoListDB') dataSource: TodoListDbDataSource,
  ) {
    super(UserCredentials, dataSource);
  }
}
