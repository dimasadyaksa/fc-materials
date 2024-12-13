import { IsNotEmpty, IsNumber } from "class-validator";

export class FollowUserDTO{
  @IsNotEmpty()
  @IsNumber()
  userId:number
}