import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { Role } from '../../../../../Domain/Entities/user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'The name of the user.',
    example: 'Ion POPESCU',
    pattern: "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*.?$",
  })
  /* Regex to match the name of a person 
      allows for "'", "-" and "," and ".".
    */
  @Matches(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*.?$/, {
    message: 'Name is not valid',
  })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({
    description: 'The email of the user.',
    example: 'Ion.Popescu@google.com',
    pattern:
      '(?!.*s)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
  })
  //Regex to check if the email is valid
  @Matches(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Invalid email',
  })
  @IsString()
  @IsOptional()
  readonly email?: string;

  @ApiPropertyOptional({
    description: 'The role of the user.',
    example: 'ADMIN',
    enum: ['ADMIN', 'USER'],
  })
  @IsEnum(Role)
  @IsOptional()
  readonly role?: Role;
}
