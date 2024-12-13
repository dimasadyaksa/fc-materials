import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus, UnauthorizedException, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { RegistrationDTO } from './dto/register';
import * as bcrypt from 'bcrypt'
import { QueryFailedError } from 'typeorm'
import { SkipAuth } from 'src/core/decorators/skip_auth';
import { SignInDTO } from './dto/sign_in';
import { FollowUserDTO } from './dto/follow';
import { AuthenticatedRequest } from 'src/core/request/authenticated_request';
import { UnfollowDTO } from './dto/unfollow';
import { PageMetaDTO } from 'src/core/request/meta';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post("/register")
  @SkipAuth()
  async register(@Body() regDTO: RegistrationDTO) {
    const salt = bcrypt.genSaltSync(10)
    regDTO.password = bcrypt.hashSync(regDTO.password, salt)

    try {
      return await this.userService.create(regDTO)
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const { code } = error.driverError
        switch (code) {
          case "23505":
            throw new HttpException("username already taken", HttpStatus.CONFLICT)
          default:
            console.error(error)
        }
      }

      throw error
    }
  }

  @Post("/sign-in")
  @SkipAuth()
  async signIn(@Body() signInDTO: SignInDTO) {
    const res = await this.userService.findByUsernamePassword(signInDTO.username, signInDTO.password)
    if (res == null) {
      throw new UnauthorizedException('Invalid username or password')
    }

    return {
      token: res
    }
  }

  @Post("/follow")
  async follow(@Body() newFollowDTO: FollowUserDTO, @Req() req: AuthenticatedRequest) {
    const followerId = req.user.id
    const followingId = newFollowDTO.userId

    if (followerId == followingId) {
      throw new HttpException("can't follow/unfollow yourself", HttpStatus.CONFLICT)
    }

    try {
      return await this.userService.follow(followerId, followingId)
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const { code } = error.driverError
        switch (code) {
          case "23503":
            throw new HttpException("user id not found", HttpStatus.CONFLICT)
          case "23505":
            throw new HttpException("already follow", HttpStatus.CONFLICT)
          default:
            console.error(error)
        }
      }

      throw error
    }
  }

  @Post("/unfollow")
  async unfollow(@Body() newUnfollowDTO: UnfollowDTO, @Req() req: AuthenticatedRequest) {
    const followerId = req.user.id
    const followingId = newUnfollowDTO.userId

    if (followerId == followingId) {
      throw new HttpException("can't follow/unfollow yourself", HttpStatus.CONFLICT)
    }

    try {
      let result = await this.userService.unfollow(followerId, followingId)

      if (result[1] == 0) {
        throw new HttpException("not following this user", HttpStatus.CONFLICT)
      }

    } catch (error) {
      if (error instanceof QueryFailedError) {
        const { code } = error.driverError
        switch (code) {
          case "23503":
            throw new HttpException("user id not found", HttpStatus.CONFLICT)
          default:
            console.error(error)
        }
      }

      throw error
    }
  }

  @Get("/me")
  async getMyProfile(@Req() req: AuthenticatedRequest) {
    let currentUserId = req.user.id

    try {
      return await this.userService.getProfileById(currentUserId)
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const { code } = error.driverError

        switch (code) {
          case "23503":
            throw new HttpException("user id not found", HttpStatus.CONFLICT)
          default:
            console.error(error)
        }
      }

      throw error
    }
  }

  @Get("/followers")
  async getFollowers(@Query() query: PageMetaDTO, @Req() req: AuthenticatedRequest) {
    let currentUserId = req.user.id

    try {
      let result = await this.userService.getFollowers(currentUserId, query)
      return result.map(u => {
        return {
          email: u.email,
          username: u.username,
        }
      });
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  @Get("/followings")
  async getFollowings(@Query() query: PageMetaDTO, @Req() req: AuthenticatedRequest) {
    let currentUserId = req.user.id

    try {
      let result = await this.userService.getFollowings(currentUserId, query)
      return result.map(u => {
        return {
          email: u.email,
          username: u.username,
        }
      });
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
