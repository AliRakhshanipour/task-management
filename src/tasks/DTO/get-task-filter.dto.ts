import { IsAlpha, IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../task-status';

export class FilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsAlpha()
  search?: string;
}
