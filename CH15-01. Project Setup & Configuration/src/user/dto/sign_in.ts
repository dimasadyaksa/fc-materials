import { IsNotEmpty, Length } from "class-validator"

export class SignInDTO{
  @IsNotEmpty()
  @Length(5,50)
  username:string

  @IsNotEmpty()
  @Length(8)
  password:string
}