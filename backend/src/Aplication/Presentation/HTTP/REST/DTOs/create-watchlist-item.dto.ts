import { IsNotEmpty, IsString } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  public readonly userId: string;

  @IsNotEmpty()
  @IsString()
  public readonly imdbId: string;
}
