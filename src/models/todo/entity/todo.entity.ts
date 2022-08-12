import { Transform } from 'class-transformer';
import { Activity } from 'src/models/activity/entity/activity.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum Active {
  ON = '1',
  OFF = '0',
}

export enum Priority {
  VERY_LOW = 'very-low',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very-high',
}

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', { enum: Active, default: Active.ON })
  is_active: Active;

  @Column('varchar')
  title: string;

  @Column('enum', { enum: Priority, default: Priority.MEDIUM })
  priority: Priority;

  @Column('timestamptz')
  created_at: Date;

  @Column('timestamptz', { nullable: true })
  updated_at: Date;

  @Column('timestamptz', { nullable: true, default: null })
  deleted_at: Date;

  @Transform(({ value }) => {
    // console.log(value);
    return value.id;
  })
  @ManyToOne(() => Activity, (todo) => todo.todos)
  @JoinColumn({ name: 'activity_group_id' })
  activity: Activity;
}
