import { IsNumber, Min } from "class-validator"

export class PageMetaDTO {
  @IsNumber()
  @Min(1)
  page: number = 1

  @IsNumber()
  @Min(1)
  limit: number = 1
}