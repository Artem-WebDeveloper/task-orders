import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Index } from 'typeorm';
import { ORDER_STATUSES, type OrderStatus } from '@task-orders/shared';
import { User } from './User.ts';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @ManyToOne(() => User, (user) => user.assignedOrders, { nullable: true })
  @JoinColumn({ name: 'assignee_id' })
  assignee!: User | null;

  @Column({ type: 'timestamptz' })
  executionAt!: Date;

  @Column({ type: 'varchar' })
  address!: string;

  @Column({ type: 'text' })
  description!: string;

  @Index()
  @Column({ type: 'enum', enum: ORDER_STATUSES, default: 'new' })
  status!: OrderStatus;
}
