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

    if (!task) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(task);
  }

  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.taskRepository.find();
    return tasks;
  }
  async getTasksWithFilter(filterDto: FilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.taskRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      const lowerCaseSearch = search.toLocaleLowerCase();
      query.andWhere(
        '(LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search)',
        { search: `%${lowerCaseSearch}%` },
      );
    }

    return await query.getMany();
  }

  async deleteTask(getTaskByIdDto: GetTaskByIdDto): Promise<void> {
    const { id } = getTaskByIdDto;
    const task: Task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(
        `Cannot delete task with id: ${getTaskByIdDto.id}! Not found!`,
      );
    }
    await this.taskRepository.remove(task);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const result = await this.taskRepository.update(id, { status });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
    return this.taskRepository.findOne({ where: { id } });
  }
}
