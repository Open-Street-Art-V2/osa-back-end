import { Test, TestingModule } from '@nestjs/testing';
import { ArtRepository } from './art.repository';
import { ArtService } from './art.service';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Picture } from './picture/picture.entity';
import { PictureService } from './picture/picture.service';
import { CreateArtDto } from './dto/create-art.dto';

describe('ArtService', () => {
  let service;
  let repository;
  let pictureRepository;
  let pictureService;

  const mockArtRepository = () => ({
    createArt: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  });

  const mockPictureRepository = () => ({
    find: jest.fn(),
    save: jest.fn(),
  });

  const mockPictureService = () => ({
    createPictures: jest.fn(),
    removePicturesFromFileSystem: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtService,
        {
          provide: ArtRepository,
          useFactory: mockArtRepository,
        },
        {
          provide: getRepositoryToken(Picture),
          useFactory: mockPictureRepository,
        },
        {
          provide: PictureService,
          useFactory: mockPictureService,
        },
      ],
    }).compile();
    service = await module.get<ArtService>(ArtService);
    repository = await module.get<ArtRepository>(ArtRepository);
    pictureService = await module.get<PictureService>(PictureService);
    pictureRepository = await module.get(getRepositoryToken(Picture));
  });

  describe('CreateArt', () => {
    it('Should save an art in the data base', async () => {
      repository.createArt.mockResolvedValue('SomeArt');
      expect(repository.createArt).not.toHaveBeenCalled();

      const createArtDto: CreateArtDto = {
        title: 'One Art',
        artist: 'Ahmadou Kassoum',
        longitude: 223,
        latitude: 222,
        description: 'Some description',
        address: 'Madrillet',
        city: 'Rouen',
      };

      const pictures = ['picture.png'];

      repository.findOne.mockResolvedValue(createArtDto);
      expect(repository.findOne).not.toHaveBeenCalled();

      const result = await service.createArt(createArtDto, pictures);
      expect(repository.createArt).toHaveBeenLastCalledWith(createArtDto);
      expect(pictureService.createPictures).toHaveBeenLastCalledWith(
        createArtDto,
        pictures,
      );
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
    it('should retrieve an art with an ID', async () => {
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
    it('should delete an art', async () => {
      const picture: Picture = {
        position: 1,
        url: 'file1.jpg',
        art: {
          title: 'Title',
          address: 'Madrillet',
          artist: 'Anthony Pierre',
          city: 'Rouen',
          description: 'some description',
          latitude: 22.44,
          longitude: 223,
        },
      };
      pictureRepository.find.mockResolvedValue([picture]);
      repository.delete.mockResolvedValue(1);
      expect(repository.delete).not.toHaveBeenCalled();

      await service.deleteArt(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(pictureService.removePicturesFromFileSystem).toHaveBeenCalledWith([
        picture.url,
      ]);
    });
  });
});
