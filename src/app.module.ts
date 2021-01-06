import { Module } from '@nestjs/common';
import { ExchangeModule } from './exchange/exchange.module';
import { CurrenciesService } from './currencies/currencies.service';
import { CurrenciesModule } from './currencies/currencies.module';

@Module({
  imports: [ExchangeModule, CurrenciesModule],
  providers: [CurrenciesService],
})
export class AppModule {}
