import Activity from '../models/Activity'
import {format} from 'date-fns'
import ActivitiesRepository  from '../repositories/ActivitiesRepository'
import {   ptBR } from 'date-fns/locale'
import { getCustomRepository} from 'typeorm'
interface Request {
  name: string;
  date : Date;
  group_id : string;
}

class CreateActivityService {

  public async execute({name, date,group_id}: Request) : Promise<Activity>{
    
   const activitiesRepository =  getCustomRepository(ActivitiesRepository)
 
  /* const activitiesRepository =  getRepository(Activity) */

  const isLate = date < new Date()
  

  const dataFormatted = format(date , 'MMM dd yyyy' , {locale :ptBR })
  /* const findActivityInSameDate = await activitiesRepository.findOne({where : {name: name}});

  if(findActivityInSameDate) {
    throw new Error('Name already exists in DB , try another name')
  } */

  const activity = activitiesRepository.create({name, date : date , group_id , isLate : isLate , date_formatted : dataFormatted})

  
  await activitiesRepository.save(activity)

  return activity

  }
}

export default CreateActivityService