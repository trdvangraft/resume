/* eslint-disable @typescript-eslint/no-unused-vars */
import {Todo, TodoList} from '../../models';
import {isArray} from 'util';

export type TodoTest = Omit<Todo, 'id' | 'todoListId'>;
export type TodoListTest = Omit<TodoList, 'id'>;

function _converter(todo: Todo): TodoTest {
  const {id, todoListId, ...result} = todo;
  return result as TodoTest;
}

function _tlistconverter(list: TodoList): TodoListTest {
  const {id, ...result} = list;
  return result as TodoListTest;
}

export function todoConverter(
  input: Todo | Array<Todo>,
): TodoTest | Array<TodoTest> {
  if (isArray(input)) return input.map(el => _converter(el));
  return _converter(input);
}

export function todoListConverter(
  input: TodoList | Array<TodoList>,
): TodoListTest | Array<TodoListTest> {
  if (isArray(input)) return input.map(el => _tlistconverter(el));
  return _tlistconverter(input);
}
