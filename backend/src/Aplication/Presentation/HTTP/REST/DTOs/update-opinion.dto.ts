import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOpinionDto {
  @IsNotEmpty()
  @IsString()
  public readonly text: string;
}
