import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, HttpException, HttpStatus } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthenticatedRequest } from 'src/core/request/authenticated_request';
import { PageMetaDTO } from 'src/core/request/meta';
import { LikePostDTO } from './dto/like-post';
import { QueryFailedError } from 'typeorm'

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post("/create")
  async create(@Body() createPostDto: CreatePostDto, @Req() req: AuthenticatedRequest) {
    let userId = req.user.id
    createPostDto.authorId = userId
    try {
      let result = await this.postService.create(createPostDto)
      return {
        content: result.content,
        likeCount: result.likesCount,
        createdAt: result.createdAt
      }
    } catch (error) {
      console.error(error)
    }
  }

  @Get("/feed")
  async getFeed(@Query() pageMeta: PageMetaDTO, @Req() req: AuthenticatedRequest) {
    let userId = req.user.id

    try {
      let result = await this.postService.getFeed(userId, pageMeta)
      return result
    } catch (error) {
      console.error(error)
      throw error
    }
  }


  @Post("/like")
  async likePost(@Req() req: AuthenticatedRequest, @Body() likePostDTO: LikePostDTO) {
    let userId = req.user.id

    try {
      let result = await this.postService.like(userId, likePostDTO.postId)
      return result
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const { code } = error.driverError
        switch (code) {
          case "23505":
            throw new HttpException("already liked this posts", HttpStatus.CONFLICT)
          default:
            console.error(error)
        }
      }
    }
  }

  @Post("/unlike")
  async unlikePost(@Req() req: AuthenticatedRequest, @Body() likePostDTO: LikePostDTO) {
    let userId = req.user.id

    let result = await this.postService.unlike(userId, likePostDTO.postId)
    if (result[1] == 0) {
      throw new HttpException("has not liked this post yet", HttpStatus.CONFLICT)
    }
  }
}
