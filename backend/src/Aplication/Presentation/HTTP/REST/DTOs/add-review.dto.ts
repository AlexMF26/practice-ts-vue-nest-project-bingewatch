import { IsNotEmpty, IsString } from 'class-validator';

export class AddReviewDto {
  @IsNotEmpty()
  @IsString()
  public readonly entryId: string;

  @IsNotEmpty()
  @IsString()
  public readonly text: string;
}
