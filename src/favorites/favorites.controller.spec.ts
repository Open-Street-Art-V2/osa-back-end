import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArtRepository } from 'src/art/art.repository';
import { UsersRepository } from 'src/users/user.repository';
import { FavoriteArt } from './entities/favorite-art.entity';
import { FavoriteArtist } from './entities/favorite-artist.entity';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

describe('FavoritesController', () => {
  let controller: FavoritesController;
  const mockFavArtRepo = () => ({
    createArt: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  });

  const mockFavArtistRepo = () => ({
    createArt: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  });

  const mockArtRepository = () => ({
    createArt: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  });

  const mockUsersRepository = () => ({
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        FavoritesService,
        {
          provide: ArtRepository,
          useFactory: mockArtRepository,
        },
        {
          provide: getRepositoryToken(FavoriteArtist),
          useFactory: mockFavArtistRepo,
        },
        {
          provide: getRepositoryToken(FavoriteArt),
          useFactory: mockFavArtRepo,
        },
        {
          provide: UsersRepository,
          useFactory: mockUsersRepository,
        },
      ],
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
