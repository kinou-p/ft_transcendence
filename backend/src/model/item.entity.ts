// item.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'User' })
export class User extends BaseEntity {

  @Column({ type: 'varchar', length: 300 , nullable: true})
  name: string;

  @Column({ type: 'varchar', length: 300 , nullable: true})
  description: string;
}