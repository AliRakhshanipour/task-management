import { TaskStatus } from '../task.model';

export class FilterDto {
  status?: TaskStatus;
  search?: string;
}
