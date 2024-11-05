import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UserRepository } from './users.repository'; // Adjust the import path as necessary

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository])],
  providers: [AuthService, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}