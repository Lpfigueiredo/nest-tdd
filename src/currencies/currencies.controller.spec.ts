import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesController } from './currencies.controller';
import { Currencies } from './entities/currencies.entity';
import { CurrenciesService } from './currencies.service';

describe('CurrenciesController', () => {
  let controller: CurrenciesController;
  let service: CurrenciesService;
  let mockData: Currencies;

  beforeEach(async () => {
    const mockService = {
      getCurrency: jest.fn(),
      createCurrency: jest.fn(),
      deleteCurrency: jest.fn(),
      updateCurrency: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrenciesController],
      providers: [
        {
          provide: CurrenciesService,
          useFactory: () => mockService,
        },
      ],
    }).compile();

    mockData = new Currencies();
    mockData.currency = 'USD';
    mockData.value = 1;
    controller = module.get<CurrenciesController>(CurrenciesController);
    service = module.get<CurrenciesService>(CurrenciesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCurrency()', () => {
    it('should throw when service throws', async () => {
      (service.getCurrency as jest.Mock).mockRejectedValue(new BadRequestException());
      await expect(controller.getCurrency('INVALID')).rejects.toThrow(new BadRequestException());
    });

    it('should call service with correct params', async () => {
      await controller.getCurrency('USD');
      expect(service.getCurrency).toBeCalledWith('USD');
    });

    it('should return when service returns', async () => {
      (service.getCurrency as jest.Mock).mockReturnValue(mockData);
      expect(await controller.getCurrency('USD')).toEqual(mockData);
    });
  });

  describe('createCurrency()', () => {
    it('should throw when service throws', async () => {
      (service.createCurrency as jest.Mock).mockRejectedValue(new BadRequestException());
      await expect(controller.createCurrency(mockData)).rejects.toThrow(new BadRequestException());
    });

    it('should call service with correct params', async () => {
      await controller.createCurrency(mockData);
      expect(service.createCurrency).toBeCalledWith(mockData);
    });

    it('should return when service returns', async () => {
      (service.createCurrency as jest.Mock).mockReturnValue(mockData);
      expect(await controller.createCurrency(mockData)).toEqual(mockData);
    });
  });

  describe('deleteCurrency()', () => {
    it('should throw when service throws', async () => {
      (service.deleteCurrency as jest.Mock).mockRejectedValue(new BadRequestException());
      await expect(controller.deleteCurrency('INVALID')).rejects.toThrow(new BadRequestException());
    });

    it('should call service with correct params', async () => {
      await controller.deleteCurrency('USD');
      expect(service.deleteCurrency).toBeCalledWith('USD');
    });
  });

  describe('updateCurrency()', () => {
    it('should throw when service throws', async () => {
      (service.updateCurrency as jest.Mock).mockRejectedValue(new BadRequestException());
      await expect(controller.updateCurrency('USD', 1)).rejects.toThrow(new BadRequestException());
    });

    it('should call service with correct params', async () => {
      await controller.updateCurrency('USD', 1);
      expect(service.updateCurrency).toBeCalledWith(mockData);
    });

    it('should return when service returns', async () => {
      (service.updateCurrency as jest.Mock).mockReturnValue(mockData);
      expect(await controller.updateCurrency('USD', 1)).toEqual(mockData);
    });
  });
});
