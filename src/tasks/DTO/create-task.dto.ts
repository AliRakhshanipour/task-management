import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({
    message: 'task title can not be empty',
  })
  title: string;
  @IsNotEmpty({
    message: 'task description can not be empty',
  })
  description: string;
}

export class GetTaskByIdDto {
  id: string;
}
