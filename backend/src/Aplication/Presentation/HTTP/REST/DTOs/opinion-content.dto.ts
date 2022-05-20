import { IsNotEmpty, IsString } from 'class-validator';

export class OpinionContentDto {
  @IsNotEmpty()
  @IsString()
  public readonly text: string;
}
