import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export const ROLE_CODES = ['operator', 'team'] as const;

export type RoleCode = (typeof ROLE_CODES)[number];

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'enum', enum: ROLE_CODES })
  code!: RoleCode;
}
