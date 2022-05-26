import Activity from '../models/Activity'

import { getRepository} from 'typeorm'
interface Request {
  id : string;
  done: boolean;
  
  
}

class UpdateActivityDonePropertyService {
  
  

  public async execute({id, done}: Request) : Promise<Activity>{
   
  const activitiesRepository =  getRepository(Activity)

  const activity = await activitiesRepository.findOne(id)
  
  if(!activity){
    throw new Error('Activity not exists');
  }
  
  

  activity.done = !done
  
  console.log(activity.done)

  await activitiesRepository.save(activity)

  return activity

  }
}

export default UpdateActivityDonePropertyService