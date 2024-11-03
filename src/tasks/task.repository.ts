import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';

export class TaskRepository extends Repository<Task> {
  constructor(dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  // Add custom methods here if needed
}
