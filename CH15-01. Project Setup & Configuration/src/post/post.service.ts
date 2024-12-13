import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm'
import { PageMetaDTO } from 'src/core/request/meta';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>
  ) { }
  async create(createPostDto: CreatePostDto) {
    const newPost = this.postRepository.create()
    newPost.content = createPostDto.content
    newPost.author = createPostDto.authorId

    let result = await this.postRepository.save(newPost)

    const query = "INSERT INTO twitter.feeds(user_id,post_id) SELECT follower_id AS user_id,$1 FROM twitter.relations WHERE following_id = $2;"
    this.postRepository.query(query, [result.id, createPostDto.authorId]).then(() => console.log("post shared"))
    return result
  }

  async getFeed(userId: number, pageMeta: PageMetaDTO) {
    const query = this.postRepository.createQueryBuilder("posts")

    query.select().
      innerJoin("feeds", "f", "f.post_id = posts.id").
      skip((pageMeta.page - 1) * pageMeta.limit).take(pageMeta.limit).
      where("f.user_id = :id", { id: userId })

    let result = await query.getRawMany()

    return result.map(data => {
      return {
        author: data.posts_author_id,
        content: data.posts_content,
        likesCount: data.posts_likes_count,
        createdAt: data.posts_created_at,
      }
    })
  }

  async like(userId: number, postId: number) {
    let result = await this.postRepository.query("INSERT INTO twitter.liked_posts(user_id,post_id)VALUES($1,$2)", [userId, postId])

    this.postRepository.query("UPDATE twitter.posts SET likes_count = likes_count + 1 WHERE id = $1", [postId]).then(() => {
      console.log("Update post completed")
    })

    return result
  }

  async unlike(userId: number, postId: number) {
    let result = await this.postRepository.query("DELETE FROM twitter.liked_posts WHERE user_id = $1 AND post_id = $2", [userId, postId])

    this.postRepository.query("UPDATE twitter.posts SET likes_count = likes_count - 1 WHERE id = $1 AND likes_count > 0", [postId]).then(() => {
      console.log("Update post completed")
    })

    return result
  }
}
