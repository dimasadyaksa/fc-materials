import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config, { DatabaseConfig, JWTConfig } from './config/config'
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { CoreModule } from './core/core.module';
import { PostModule } from './post/post.module';
import { Post } from './post/entities/post.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      envFilePath: ['.env'],
      isGlobal: true
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const cfg = configService.get<JWTConfig>("jwt")
        return {
          secret: cfg.secret,
          signOptions: {
            algorithm: cfg.algorithm,
            expiresIn: cfg.expires,
            audience: cfg.audience,
            issuer: cfg.issuer,
          }
        }
      }
    }),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>{
        const cfg = configService.get<DatabaseConfig>("database")
        return {
          type: "postgres",
          host: cfg.host,
          port: cfg.port,
          username: cfg.username,
          password: cfg.password,
          database: cfg.database,
          synchronize:cfg.synchronized,
          schema: "twitter",
          namingStrategy: new SnakeNamingStrategy(),
          entities: [User,Post],
          autoLoadEntities:true
        }
      }
    }),
    CoreModule,
    AuthModule,
    UserModule,
    PostModule
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule { }
