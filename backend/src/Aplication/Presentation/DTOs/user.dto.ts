import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  /* Regex to match the name of a person 
    allows for "'", "-" and "," and ".".
  */
  @Matches(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*.?$/, {
    message: 'Name is not valid',
  })
  readonly name: string;
  @ApiProperty()
  @IsString()
  //Regex to check if the email is valid
  @Matches(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Invalid email',
  })
  readonly email: string;
  @ApiProperty()
  @IsString()
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
        'Your password is too weak.\nUse at least 8 characters, one uppercase, one lowercase, one number and one special character',
    },
  )
  readonly password: string;
}
