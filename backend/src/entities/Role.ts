import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ROLE_CODES, type RoleCode } from '@task-orders/shared';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'enum', enum: ROLE_CODES, unique: true })
  code!: RoleCode;
}
