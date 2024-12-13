import { IsEmail, IsNotEmpty, Length } from "class-validator"

export class RegistrationDTO {
  @IsEmail()
  email:string

  @IsNotEmpty()
  @Length(5,50)
  username:string

  @IsNotEmpty()
  @Length(8)
  password:string
}
