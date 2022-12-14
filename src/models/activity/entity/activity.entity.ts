import { Transform } from 'class-transformer';
import stringToUuid from 'src/common/helper/convertUUID';
import { Todo } from 'src/models/todo/entity/todo.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('activity')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Transform(({ value }) => {
    // console.log(value);
    const [name, mail] = value.split('@');
    return `${stringToUuid(name)}@${mail}`;
  })
  @Column('varchar')
  email: string;

  @Column('varchar')
  title: string;

  @Column('timestamp')
  created_at: Date;

  @Column('timestamp', { nullable: true })
  updated_at: Date;

  @Column('timestamp', { nullable: true, default: null })
  deleted_at: Date;

  //   One to many
  @OneToMany(() => Todo, (todo) => todo.activity)
  todos: Todo[];
}
