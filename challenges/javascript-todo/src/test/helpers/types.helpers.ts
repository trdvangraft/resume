/* eslint-disable @typescript-eslint/no-unused-vars */
import {Todo} from '../../models';
import {isArray} from 'util';

export type TodoTest = Omit<Todo, 'id' | 'todoListId'>;

function _converter(todo: Todo): TodoTest {
  const {id, todoListId, ...result} = todo;
  return result as TodoTest;
}

export function todoConverter(input: Todo | Array<Todo>): Todo | Array<Todo> {
  if (isArray(input)) return input.map(el => _converter(el));
  return _converter(input);
}
