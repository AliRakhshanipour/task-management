import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './DTO/create-task.dto';
import { FilterDto } from './DTO/get-task-filter.dto';
import { UpdateTaskStatusDto } from './DTO/update-task.dto';

import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { GetTaskByIdDto } from './DTO/get-task-id.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('')
  async getTasks(@Query() filterDto: FilterDto): Promise<Task[]> {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilter(filterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Post('create')
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const task = await this.tasksService.createTask(createTaskDto, user);
    return task;
  }

  @Get('/:id')
  async getTaskById(@Param() getTaskByIdDto: GetTaskByIdDto): Promise<Task> {
    return this.tasksService.getTaskById(getTaskByIdDto);
  }

  @Delete('/:id')
  async deleteTask(@Param() getTaskByIdDto: GetTaskByIdDto): Promise<void> {
    this.tasksService.deleteTask(getTaskByIdDto);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status);
  }
}
