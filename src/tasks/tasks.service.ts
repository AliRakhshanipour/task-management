import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './DTO/create-task.dto';
import { FilterDto } from './DTO/get-task-filter.dto';
import { GetTaskByIdDto } from './DTO/get-task-id.dto';
import { TaskStatus } from './task-status';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  constructor(
    @InjectRepository(Task)
    private taskRepository: TaskRepository,
  ) {}

  async getTaskById(getTaskByIdDto: GetTaskByIdDto): Promise<Task> {
    const { id } = getTaskByIdDto;
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .select(['task.title', 'task.description', 'task.status'])
      .where('task.id = :id', { id })
      .getOne();
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task: Task = await this.taskRepository.save({ title, description });

    return task;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }
  getTasksWithFilter(filterDto: FilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      const lowerCaseSearch = search.toLocaleLowerCase();
      tasks = tasks.filter((task) => {
        return (
          task.title.toLocaleLowerCase().includes(lowerCaseSearch) ||
          task.description.toLocaleLowerCase().includes(lowerCaseSearch)
        );
      });
    }

    return tasks;
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
