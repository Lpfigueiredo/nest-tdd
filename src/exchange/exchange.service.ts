import { BadRequestException, Injectable } from '@nestjs/common';
import { CurrenciesService } from '../currencies/currencies.service';
import { ExchangeInputType } from './types/exchange-input.type';
import { ExchangeOutputType } from './types/exchange-output.type';

@Injectable()
export class ExchangeService {
  constructor(private currenciesService: CurrenciesService) {}

  async convertAmount({ from, to, amount }: ExchangeInputType): Promise<ExchangeOutputType> {
    if (!from || !to || !amount) {
      throw new BadRequestException();
    }

    const currencyFrom = await this.currenciesService.getCurrency(from);
    const currencyTo = await this.currenciesService.getCurrency(to);

    return { amount: (currencyFrom.value / currencyTo.value) * amount };
  }
}
