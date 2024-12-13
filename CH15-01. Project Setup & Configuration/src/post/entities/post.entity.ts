import { User } from 'src/user/entities/user.entity'
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, nullable: false })
  content: string

  @Column({ type: 'integer', default: 0 })
  likesCount: number

  @ManyToOne(()=>User,user=>user.posts)
  author:number

  @Column({ type: 'timestamptz', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: number

  @Column({ type: 'timestamptz', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: number

  @Column({ type: 'timestamptz', nullable: true })
  deletedAt: number

  @ManyToMany(()=>User,user=>user.feed)
  @JoinTable({name:"feeds",joinColumns:[{name:"post_id"}],inverseJoinColumns:[{name:"user_id"}]})
  viewers: User[]

  @ManyToMany(()=>User,user=>user.likes)
  @JoinTable({name:"liked_posts",joinColumns:[{name:"post_id"}],inverseJoinColumns:[{name:"user_id"}]})
  likedBy: User[]
}
