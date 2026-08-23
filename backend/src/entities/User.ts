import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Role } from './Role.ts';
import { Order } from './Order.ts';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @Column({ type: 'varchar' })
  fullname!: string;

  @Column({ type: 'varchar', unique: true })
  phone!: string;

  @Column({ type: 'varchar', name: 'password_hash', select: false })
  passwordHash!: string;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @OneToMany(() => Order, (order) => order.assignee)
  assignedOrders!: Order[];
}
