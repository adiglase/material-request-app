import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MaterialRequest } from './material-request.entity';

@Entity({ name: 'material_details' })
export class MaterialDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'request_id', type: 'integer' })
  requestId: number;

  @ManyToOne(
    () => MaterialRequest,
    (materialRequest) => materialRequest.materialDetails,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'request_id' })
  request: MaterialRequest;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  category: string;

  @Column({ type: 'text', nullable: true })
  specification: string | null;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  quantity: number;

  @Column({ type: 'varchar', length: 30 })
  unit: string;

  @Column({ type: 'text', nullable: true })
  remarks: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
