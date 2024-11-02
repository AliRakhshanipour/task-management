import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { CreateTaskDto, GetTaskByIdDto } from './DTO/create-task.dto';
import { FilterDto } from './DTO/get-task-filter.dto';
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(filterDto: FilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(
        (task) => task.status === status.toLocaleUpperCase(),
      );
    }
    if (search) {
      tasks = tasks.filter((task) => {
        if (
          task.title.toLocaleLowerCase().includes(search) ||
          task.description.toLocaleLowerCase().includes(search)
        ) {
          return true;
        }
        return false;
      });
    }
    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuidV4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  getTaskById(getTaskByIdDto: GetTaskByIdDto): Task {
    const { id } = getTaskByIdDto;
    const task: Task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(
        `task with id: ${getTaskByIdDto.id} not found`,
      );
    }
    return task;
  }

  deleteTask(getTaskByIdDto: GetTaskByIdDto) {
    const { id } = getTaskByIdDto;
    const task: Task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(
        `can not delete task with id: ${getTaskByIdDto.id} ! not found !`,
      );
    }
    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    if (taskIndex !== -1) {
      // Task exists, remove it
      this.tasks = this.tasks.filter((task) => task.id !== id);
      console.log(`Task with id ${id} has been removed.`);
    } else {
      // Task does not exist
      console.log(`Task with id ${id} not found.`);
    }
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task: Task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`task with id: ${id} not found`);
    }
    task.status = status;

    return task;
  }
}
