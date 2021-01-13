import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeInputDto } from './dto/exchange-input.dto';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { ExchangeOutputType } from './types/exchange-output.type';

describe('ExchangeController', () => {
  let controller: ExchangeController;
  let service: ExchangeService;
  let mockData: ExchangeInputDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeController],
      providers: [
        {
          provide: ExchangeService,
          useFactory: () => ({ convertAmount: jest.fn() }),
        },
      ],
    }).compile();

    controller = module.get<ExchangeController>(ExchangeController);
    service = module.get<ExchangeService>(ExchangeService);
    mockData = new ExchangeInputDto();
    mockData.from = 'INVALID';
    mockData.to = 'INVALID';
    mockData.amount = 1;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('convertAmount()', () => {
    it('should throw when service throws', async () => {
      (service.convertAmount as jest.Mock).mockRejectedValue(new BadRequestException());
      await expect(controller.convertAmount(mockData)).rejects.toThrow(new BadRequestException());
    });

    it('should call service with correct params', async () => {
      await controller.convertAmount(mockData);
      expect(service.convertAmount).toBeCalledWith(mockData);
    });

    it('should call service with correct params', async () => {
      const mockReturn: ExchangeOutputType = { amount: 1 };
      (service.convertAmount as jest.Mock).mockReturnValue(mockReturn);
      expect(await controller.convertAmount(mockData)).toEqual(mockReturn);
    });
  });
});
