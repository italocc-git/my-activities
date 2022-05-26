import Activity from '../models/Activity'
import {  enUS , ptBR } from 'date-fns/locale'
import {format, startOfHour} from 'date-fns'
import { getRepository} from 'typeorm'
interface Request {
  id : string;
  name: string;
  date : Date;
  
}

class UpdateActivityService {
  
  

  public async execute({id, name, date}: Request) : Promise<Activity>{
   
  const activitiesRepository =  getRepository(Activity)

  const activity = await activitiesRepository.findOne({where : {id}})
  
  if(!activity){
    throw new Error('Activity not exists');
  }
  
  activity.name = name;
  activity.date = date;
  activity.isLate = date < new Date();
  activity.date_formatted = format(date,'MMM dd yyyy HH:mm' , {locale:ptBR})
  
  

  await activitiesRepository.save(activity)

  return activity

  }
}

export default UpdateActivityService