import { CreateArtDto } from './dto/create-art.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { ArtRepository } from './art.repository';
import { ArtService } from './art.service';
import { NotFoundException } from '@nestjs/common';

describe('ArtService', () => {
  let service;
  let repository;

  const mockArtRepository = () => ({
    createArt: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtService,
        {
          provide: ArtRepository,
          useFactory: mockArtRepository,
        },
      ],
    }).compile();
    service = await module.get<ArtService>(ArtService);
    repository = await module.get<ArtRepository>(ArtRepository);
  });

  describe('CreateArt', () => {
    it('Should save a art in the data base', async () => {
      repository.createArt.mockResolvedValue('SomeArt');
      expect(repository.createArt).not.toHaveBeenCalled();
      const createArtDto: CreateArtDto = {
        title: 'One Art',
        artist: 'Ahmadou Kassoum',
        longitude: 223,
        latitude: 222,
      };
      const result = await service.createArt(createArtDto);
      expect(repository.createArt).toHaveBeenLastCalledWith(createArtDto);
      expect(result).toEqual('SomeArt');
    });
  });

  describe('getArts', () => {
    it('Should get all arts', async () => {
      repository.find.mockResolvedValue('SomeArt');
      expect(repository.find).not.toHaveBeenCalled();
      const result = await service.getArts();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual('SomeArt');
    });
  });

  describe('getArt', () => {
    it('should retrieve a art with an ID', async () => {
      const mockArt = {
        title: 'Another Art',
        artist: 'Ahmadou Kassoum Bachir',
        longitude: 1415,
        latitude: 1315,
      };
      repository.findOne.mockResolvedValue(mockArt);
      const result = await service.getArt(1);
      expect(result).toEqual(mockArt);
      expect(repository.findOne).toHaveBeenCalledWith(1);
    });

    it('throws an error as a art is not found', () => {
      repository.findOne.mockResolvedValue(null);
      expect(service.getArt(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteArt', () => {
    it('should delete art', async () => {
      repository.delete.mockResolvedValue(1);
      expect(repository.delete).not.toHaveBeenCalled();
      await service.deleteArt(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
