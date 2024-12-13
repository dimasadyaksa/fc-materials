import { IsNotEmpty, IsNumber } from "class-validator";

export class UnfollowDTO{
  @IsNotEmpty()
  @IsNumber()
  userId:number
}