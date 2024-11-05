import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './DTO/auth-credentials.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async signUp(authCredentials: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredentials);
  }
}
