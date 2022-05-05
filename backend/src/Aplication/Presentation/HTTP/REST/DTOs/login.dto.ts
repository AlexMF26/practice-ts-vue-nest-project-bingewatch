import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The email of the user.',
    example: 'Ion.Popescu@google.com',
    pattern: '[w-.]+@([w-]+.)+[w-]{2,4}$',
  })
  //Regex to check if the email is valid
  @Matches(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Invalid email',
  })
  @IsString()
  public readonly email: string;

  @ApiProperty({
    description:
      'The password of the user. Must be at least 8 characters long and contain at least one number, one uppercase letter, lowercase letter and one special character.',
    example: 'P@ssword123',
    pattern:
      '(?!.*s)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
  })
  /*
    (?!.*\s)          # Must contain no whitespace characters
    (?=.*[a-z])       # Must contain at least one lowercase letter
    (?=.*[A-Z])       # Must contain at least one upercase letter
    (?=.*[0-9])       # Must contain at least one digit
    (?=.*[!@#\$%\^&]) # Must contain at least one special character
    (?=.{8,})         # Must be at least 8 characters long
  */
  @Matches(
    /(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
    {
      message:
        "Your password isn't valid. Our passwords use at least 8 characters, one uppercase, one lowercase, one number and one special character.",
    },
  )
  @IsString()
  public readonly password: string;
}
