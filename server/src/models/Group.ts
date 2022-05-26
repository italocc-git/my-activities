import {Entity, Column, PrimaryGeneratedColumn , CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany} from 'typeorm'
import User from './User'

@Entity('groups')
class Group {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
  
  @Column()
  user_id : string;

  @ManyToOne(() => User  )
  @JoinColumn({name : 'user_id'})
  group : User

  
  @CreateDateColumn()
  created_at : Date;

  @UpdateDateColumn()
  updated_at : Date;
}

export default Group