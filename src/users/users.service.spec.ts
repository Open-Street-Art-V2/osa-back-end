import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './user.repository';
import { CreateUserDTO } from './dto/create-user.dto';
import { PasswordDTO } from './dto/update-password.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateUserProfileDTO } from './dto/update-user-profile.dto';
import { Role } from 'src/auth/roles/role.enum';

describe('UsersService', () => {
  let service;
  let repository;

  const mockUsersRepository = () => ({
    createUser: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    editPassword: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useFactory: mockUsersRepository,
        },
      ],
    }).compile();
    service = await module.get<UsersService>(UsersService);
    repository = await module.get<UsersRepository>(UsersRepository);
  });

  describe('CreateUser', () => {
    it('Should save a user in the data base', async () => {
      repository.createUser.mockResolvedValue('SomeUser');
      expect(repository.createUser).not.toHaveBeenCalled();

      const createUserDto: CreateUserDTO = {
        email: 'test@test.fr',
        password: '1234',
        name: 'tarek',
        firstname: 'tarek',
        birthDate: new Date(),
      };
      const result = await service.createUser(createUserDto);
      expect(repository.createUser).toHaveBeenLastCalledWith(createUserDto);
      expect(result).toEqual('SomeUser');
    });
  });

  describe('getUserByLogin', () => {
    it('should retrieve a user with an email', async () => {
      const email = 'test@test.fr';
      const mockUser = {
        email,
        password: '9876',
      };
      repository.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await service.getUserByLogin(email);
      expect(result).toEqual(mockUser);

      const param = {
        where: { email },
      };
      expect(repository.findOne).toHaveBeenCalledWith(param);
    });

    it('throws an error as a user is not found', () => {
      repository.findOne = jest.fn().mockResolvedValue(null);
      expect(service.getUserByLogin('test@test.fr')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteUser', () => {
    it('Should delete user with given id from database', async () => {
      const deleteResult: DeleteResult = { raw: [], affected: 1 };
      repository.delete.mockResolvedValue(deleteResult);
      expect(repository.delete).not.toHaveBeenCalled();

      // eslint-disable-next-line @typescript-eslint/no-inferrable-types
      const id: number = 5;
      const result = await service.deleteUser(id);
      expect(repository.delete).toHaveBeenLastCalledWith({ id: id });
      expect(result).toEqual({ raw: [], affected: 1 });
    });
  });

  describe('changePassword', () => {
    it('Should change logged in user password', async () => {
      const updateResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 1,
      };
      repository.editPassword.mockResolvedValue(updateResult);
      expect(repository.editPassword).not.toHaveBeenCalled();

      const id = 5;
      const passwordDTO: PasswordDTO = { password: 'newPassword' };
      const result = await service.changePassword(
        { password: 'newPassword' },
        id,
      );
      expect(repository.editPassword).toHaveBeenLastCalledWith(
        id,
        passwordDTO.password,
      );
      expect(result).toEqual(updateResult);
    });
  });

  describe('editProfile', () => {
    it('Update provided user profile fields info with provided data', async () => {
      const updateResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 1,
      };
      repository.update.mockResolvedValue(updateResult);
      expect(repository.update).not.toHaveBeenCalled();

      // eslint-disable-next-line @typescript-eslint/no-inferrable-types
      const id: number = 5;
      const updateUserProfileDTO: UpdateUserProfileDTO = {
        name: 'Notme',
        firstname: 'Notme',
      };

      const result = await service.editProfile(updateUserProfileDTO, id);
      expect(repository.update).toHaveBeenLastCalledWith(
        { id: id },
        { ...updateUserProfileDTO },
      );
      expect(result).toEqual(updateResult);
    });
  });

  describe('changeRole', () => {
    it('Change the role of user with provided ID', async () => {
      const updateResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 1,
      };
      repository.update.mockResolvedValue(updateResult);
      expect(repository.update).not.toHaveBeenCalled();

      const id = 5;
      const role = Role.ADMIN;

      const result = await service.changeRole(id, role);
      expect(repository.update).toHaveBeenLastCalledWith(
        { id: id },
        { role: role },
      );
      expect(result).toEqual(updateResult);
    });
  });
});
