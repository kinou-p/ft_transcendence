// item.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity.js';

@Entity({ name: 'user' })
export class User extends BaseEntity {

  @Column({ type: 'varchar', length: 300 , nullable: true})
  name: string;

  @Column({ type: 'varchar', length: 300 , nullable: true})
  description: string;
}