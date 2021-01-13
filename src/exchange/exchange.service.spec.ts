import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesService } from '../currencies/currencies.service';
import { ExchangeService } from './exchange.service';
import { ExchangeInputDto } from './dto/exchange-input.dto';

describe('ExchangeService', () => {
  let service: ExchangeService;
  let currenciesService: CurrenciesService;
  let mockData: ExchangeInputDto;

  beforeEach(async () => {
    const currenciesServiceMock = {
      getCurrency: jest.fn().mockResolvedValue({ value: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        { provide: CurrenciesService, useFactory: () => currenciesServiceMock },
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
    currenciesService = module.get<CurrenciesService>(CurrenciesService);
    mockData = { from: 'USD', to: 'BRL', amount: 1 };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertAmount()', () => {
    it('should throw if called with invalid params', async () => {
      mockData.from = '';
      await expect(service.convertAmount(mockData)).rejects.toThrow(new BadRequestException());
      mockData.from = 'USD';
      mockData.to = '';
      await expect(service.convertAmount(mockData)).rejects.toThrow(new BadRequestException());
      mockData.to = 'BRL';
      mockData.amount = 0;
      await expect(service.convertAmount(mockData)).rejects.toThrow(new BadRequestException());
    });

    it('should not throw if called with valid params', async () => {
      await expect(service.convertAmount(mockData)).resolves.not.toThrow();
    });

    it('should call getCurrency twice', async () => {
      await service.convertAmount(mockData);
      expect(currenciesService.getCurrency).toBeCalledTimes(2);
    });

    it('should call getCurrency with correct params', async () => {
      await service.convertAmount(mockData);
      expect(currenciesService.getCurrency).toBeCalledWith('USD');
      expect(currenciesService.getCurrency).toHaveBeenLastCalledWith('BRL');
    });

    it('should throw if getCurrency throws', async () => {
      (currenciesService.getCurrency as jest.Mock).mockRejectedValue(new Error());
      mockData.from = 'INVALID';
      await expect(service.convertAmount(mockData)).rejects.toThrow();
    });

    it('should return converted value', async () => {
      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({
        value: 1,
      });

      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({
        value: 0.2,
      });
      expect(await service.convertAmount(mockData)).toEqual({
        amount: 5,
      });
    });

    it('should return converted value', async () => {
      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({
        value: 0.2,
      });

      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({
        value: 1,
      });
      expect(await service.convertAmount({ from: 'BRL', to: 'USD', amount: 2 })).toEqual({
        amount: 0.4,
      });
    });

    it('should return converted value', async () => {
      (currenciesService.getCurrency as jest.Mock).mockResolvedValue({
        value: 1,
      });
      expect(await service.convertAmount({ from: 'USD', to: 'USD', amount: 1 })).toEqual({
        amount: 1,
      });
    });
  });
});
