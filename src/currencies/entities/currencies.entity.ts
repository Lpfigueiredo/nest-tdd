import { IsNotEmpty, IsNumber, Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique(['currency'])
@Entity()
export class Currencies {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Length(3, 3)
  @IsNotEmpty()
  currency: string;

  @Column('numeric')
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
