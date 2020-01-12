import {
    inject,
    LifeCycleObserver,
    ValueOrPromise,
} from '@loopback/core';
import { juggler } from "@loopback/repository";
import config from './testdb.datasource.config.json';

export class TestDb extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'TodoListTestDB';
  static instance: TestDb

  constructor(
    @inject('datasources.config.TodoListTestDB', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
    if (TestDb.instance) {
      return TestDb.instance
    }
    
    TestDb.instance = this

    return this
  }

    /**
   * Start the datasource when application is started
   */
  start(): ValueOrPromise<void> {
    // Add your logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}

export const testdb = new TestDb()