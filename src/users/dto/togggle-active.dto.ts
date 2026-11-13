import { IsNotEmpty } from 'class-validator';

export class ToggleActiveDto {
  @IsNotEmpty()
  isActive: boolean;
}
