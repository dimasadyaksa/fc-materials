import { IsNumber } from "class-validator";

export class LikePostDTO{
  @IsNumber()
  postId:number
}