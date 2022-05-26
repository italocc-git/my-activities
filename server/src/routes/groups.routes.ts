import { Router} from 'express'
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import CreateGroupService from '../services/CreateGroupService'
import UpdateGroupService from '../services/UpdateGroupService'
import Group from '../models/Group'
import {getRepository} from 'typeorm'
export const groupsRouter = Router();

groupsRouter.use(ensureAuthenticated);

 
groupsRouter.put('/:id', async(req,resp) => {
  //requisição por ID
  
  try{
    const {id} = req.params
    const { name } = req.body 

    const updateGroup = new UpdateGroupService();
   
    const group = await updateGroup.execute({ id, name})
    
    return resp.status(200).json(group)

  }catch(error){
    return resp.status(400).json({error : error.message})
  }
  

}) 

groupsRouter.get('/' , async (req, resp) => {
  
  const {id} = req.user

  try {
    const groupsRepository = getRepository(Group);

    const findGroup = await groupsRepository.find({
      where : {user_id : id},
      order: {
        name: 'ASC'
      }
    });

    return resp.json(findGroup).status(200)
  }catch(error) {
    return resp.status(400).json({error : error.message})
  }
  
})

groupsRouter.get('/:id' , async (req, resp) => {
  const {id} = req.params

  try {
    const groupsRepository = getRepository(Group);

    const findGroup = await groupsRepository.find({
      where : {user_id : id},
      order: {
        name: 'ASC'
      }
    });

    return resp.json(findGroup).status(200)
  }catch(error) {
    return resp.status(400).json({error : error.message})
  }
})



groupsRouter.post('/' , async (req, resp) => {

  try {
  const {name , user_id} = req.body;
   
  const createGroup = new CreateGroupService();

  const group = await createGroup.execute({name, user_id})

  return resp.status(201).json(group)
  }
  catch(error){
    return resp.status(400).json({error : error.message})
  }
})

 groupsRouter.delete('/:id' , async (req , resp) => {

  try {
  const {id} = req.params;

  const groupsRepository = getRepository(Group);

  const findGroup = await groupsRepository.find({id})
    if(findGroup){
      await groupsRepository.delete({id})
    }
  

  return resp.status(200).json(findGroup);

  }catch(error) {
    return resp.status(400).json({error : error.message})
  }
  
  
});   

