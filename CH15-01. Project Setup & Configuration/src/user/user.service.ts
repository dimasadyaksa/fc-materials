import { Injectable } from '@nestjs/common';
import { RegistrationDTO } from './dto/register';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { AuthService } from 'src/auth/auth.service';
import { PageMetaDTO } from 'src/core/request/meta';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private authService: AuthService
  ) { }
  async create(regDTO: RegistrationDTO) {
    const newUser = this.userRepository.create()

    newUser.email = regDTO.email
    newUser.username = regDTO.username
    newUser.password = regDTO.password

    const result = await this.userRepository.save(newUser)
    return {
      username: result.username,
      email: result.email,
    }
  }

  async findByUsernamePassword(username: string, password: string) {
    let user = await this.userRepository.findOneBy({ username: username })
    if (!user) {
      return null
    }

    const isMatched = bcrypt.compareSync(password, user.password)
    if (!isMatched) {
      return null
    }

    return this.authService.generateToken(user.id, user.username)
  }

  async follow(followerId: number, followingId: number) {
    return await this.userRepository.query("INSERT INTO twitter.relations(follower_id,following_id)VALUES($1,$2)", [followerId, followingId])
  }

  async unfollow(followerId: number, followingId: number) {
    return await this.userRepository.query("DELETE FROM twitter.relations WHERE follower_id = $1 AND following_id = $2", [followerId, followingId])
  }

  async getProfileById(userId: number) {
    let user = await this.userRepository.findOneBy({ id: userId })
    let followerCount = await this.getFollowerCount(userId)
    let followingCount = await this.getFollowingCount(userId)
    console.log(followerCount, followingCount)
    return {
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      followersCount: followerCount,
      followingCount: followingCount,
    }
  }

  async getFollowerCount(userId: number) {
    let result = await this.userRepository.query("SELECT COUNT(follower_id) FROM twitter.relations WHERE following_id = $1", [userId])
    return result[0].count
  }

  async getFollowingCount(userId: number) {
    let result = await this.userRepository.query("SELECT COUNT(following_id) FROM twitter.relations WHERE follower_id = $1", [userId])
    return result[0].count
  }

  async getFollowers(userId: number, pageMeta: PageMetaDTO) {
    let query = this.userRepository.createQueryBuilder("users")
    query.select().
      innerJoin("relations", "r", "r.follower_id = users.id")
      .skip((pageMeta.page - 1) * (pageMeta.limit)).take(pageMeta.limit).where("r.following_id = :id", { id: userId })

    let result = await query.getMany()
    return result
  }

  async getFollowings(userId: number, pageMeta: PageMetaDTO) {
    let query = this.userRepository.createQueryBuilder("users")
    query.select().
      innerJoin("relations", "r", "r.following_id = users.id")
      .skip((pageMeta.page - 1) * (pageMeta.limit)).take(pageMeta.limit).where("r.follower_id = :id", { id: userId })

    let result = await query.getMany()
    return result
  }

}
