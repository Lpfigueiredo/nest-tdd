import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Currencies } from 'src/currencies/entities/currencies.entity';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'nest-tdd',
  entities: [Currencies],
  synchronize: true,
  autoLoadEntities: true,
};
