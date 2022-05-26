import Group from '../models/Group'
import {getRepository} from 'typeorm'

interface Request {
  id: string;
  name : string;
}

class UpdateGroupService {
  
  public async execute({id, name}: Request) : Promise<Group>{
    
  const groupsRepository =  getRepository(Group);

  const group = await groupsRepository.findOne({where : {id }})
  
   if(!group){
    throw new Error('Group not Exists')
  }

  

  group.name = name;

  

  await groupsRepository.save(group);

  return group

  }
}

export default UpdateGroupService