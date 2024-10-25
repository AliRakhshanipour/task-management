import { Body, Controller, Get, Post } from '@nestjs/common';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('/tasks')
  getAllTasks(): Task[] {
    const tasks: Task[] = this.tasksService.getAllTasks();
    return tasks;
  }

  @Post('create')
  createTask(
    @Body('title') title: string,
    @Body('description') description: string,
  ): Task {
    const task = this.tasksService.createTask(title, description);
    return task;
  }
}
