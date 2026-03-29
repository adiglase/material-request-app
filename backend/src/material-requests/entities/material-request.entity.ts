import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MaterialDetail } from './material-detail.entity';

@Entity({ name: 'material_requests' })
export class MaterialRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'request_number', type: 'varchar', length: 30, unique: true })
  requestNumber: string;

  @Column({ name: 'request_date', type: 'date' })
  requestDate: string;

  @Column({ name: 'requester_name', type: 'varchar', length: 100 })
  requesterName: string;

  @Column({ type: 'text' })
  purpose: string;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => MaterialDetail, (materialDetail) => materialDetail.request)
  materialDetails: MaterialDetail[];
}
