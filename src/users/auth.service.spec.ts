import { User } from './user.entity';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
      findOne: (params) => {
        const findedUser = users.find((user) => user.email == params.email);
        return Promise.resolve(findedUser);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup('asd@sdas.com', 'password');
    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('test@test.com', 'mypassword');
    await expect(service.signup('test@test.com', 'mypassword')).rejects.toThrow(
      'email already in use',
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signin('asdd@assad.ass', 'adssad')).rejects.toThrow(
      'user not found',
    );
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('test@test.com', 'mypassword');
    await expect(
      service.signin('test@test.com', 'mypassword1'),
    ).rejects.toThrow('bad password');
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('email@email.com', 'mypassword');
    const user = await service.signin('email@email.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
