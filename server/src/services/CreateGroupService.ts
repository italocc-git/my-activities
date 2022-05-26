import Group from '../models/Group'
import {getRepository} from 'typeorm'

interface Request {
  name: string;
  user_id : string;
}

class CreateGroupService {
  
  public async execute({name, user_id}: Request) : Promise<Group>{
    
  const groupsRepository =  getRepository(Group);

  const checkGroupExists = await groupsRepository.findOne({where : {name: name}})
  
   if(checkGroupExists){
    throw new Error('Group is already created, try another one')
  }

  const group = groupsRepository.create({
    name, 
    user_id
  })

  await groupsRepository.save(group)

  return group

  }
}

export default CreateGroupService