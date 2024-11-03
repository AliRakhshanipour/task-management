import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './DTO/create-task.dto';
import { FilterDto } from './DTO/get-task-filter.dto';
import { UpdateTaskStatusDto } from './DTO/update-task.dto';

import { GetTaskByIdDto } from './DTO/get-task-id.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('')
  getTasks(@Query() filterDto: FilterDto): Task[] {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilter(filterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Post('create')
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    const task = await this.tasksService.createTask(createTaskDto);
    return task;
  }

  @Get('/:id')
  async getTaskById(@Param() getTaskByIdDto: GetTaskByIdDto): Promise<Task> {
    return this.tasksService.getTaskById(getTaskByIdDto);
  }

  @Delete('/:id')
  deleteTask(@Param() getTaskByIdDto: GetTaskByIdDto): void {
    const task = this.tasksService.deleteTask(getTaskByIdDto);
    return task;
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Task {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status);
  }
}
