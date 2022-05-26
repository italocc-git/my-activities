import {
   Entity,
   Column,
   ManyToOne,
   PrimaryGeneratedColumn ,
   CreateDateColumn,
   UpdateDateColumn,
   JoinColumn} 
   from 'typeorm'
  import Group from './Group'

@Entity('activities')
class Activity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  group_id : string;

  @ManyToOne(() => Group  , { eager : true} )
  @JoinColumn({name : 'group_id'}  ) 
  group : Group 
  
  /* @ManyToOne(() => Group  , activities => Activity  )
  groups : Group */

  @Column('timestamp with time zone')
  date : Date;

  @Column()
  date_formatted : string;

  @Column()
  isLate : boolean;

  @Column()
  done : boolean;

  @CreateDateColumn()
  created_at : Date;

  @UpdateDateColumn()
  updated_at : Date;
}

export default Activity