import { Post } from 'src/post/entities/post.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50, nullable: false, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: "varchar", length: 70, nullable: false })
  password: string

  @Column({ type: "timestamptz", nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: number;

  @Column({ type: "timestamptz", nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: number;

  @Column({ type: "timestamptz", nullable: true })
  deletedAt: number;

  @OneToMany(()=>Post,post=>post.author)
  posts: Post[]

  @ManyToMany(() => User, user => user.followers)
  @JoinTable({ name: "relations", joinColumns: [{ name: "follower_id" }], inverseJoinColumns: [{ name: "following_id" }] })
  following: User[]

  @ManyToMany(() => User, user => user.following)
  followers: User[]

  @ManyToMany(()=>Post,post=>post.viewers)
  feed: Post[]

  @ManyToMany(()=>Post,post=>post.likedBy)
  likes: Post[]
}

// Follow & Unfollow -> Many to Many
// |follower_id | following_id |
// |    1       |      2       |
// |    2       |      1       |  
// |    3       |      2       |