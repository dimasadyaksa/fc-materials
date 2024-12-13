import { IsNumber } from "class-validator";

export class UnlikePostDTO{
  @IsNumber()
  postId:number
}