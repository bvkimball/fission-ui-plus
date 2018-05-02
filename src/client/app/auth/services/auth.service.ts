import { Injectable } from '@angular/core';
import { Credentials, User } from '../auth.state';

@Injectable()
export class AuthService {
  async login({ username, password }: Credentials): Promise<User> {
    if (username === 'test') {
      return Promise.reject('Invalid username or password');
    }
    return Promise.resolve({ name: username });
  }

  async logout() {
    return Promise.resolve(true);
  }
}
