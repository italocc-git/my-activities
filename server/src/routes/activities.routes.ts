import { Router} from 'express'
import {parseISO , format} from 'date-fns'
import {getCustomRepository , Like} from 'typeorm'
import CreateActivityService from '../services/CreateActivityService'
import UpdateActivityService from '../services/UpdateActivityService'
import ActivitiesRepository from '../repositories/ActivitiesRepository';
import UpdateActivityDonePropertyService from '../services/UpdateActivityDonePropertyService'
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

export const activitiesRouter = Router();

activitiesRouter.use(ensureAuthenticated);


activitiesRouter.put('/:id', async(req,resp) => {
  //requisição por ID
  
  try{
    const {id} = req.params
    const { name , date } = req.body 
    
    const updateActivity = new UpdateActivityService();
   
     const parsedDate = parseISO(date)
     

    const activity = await updateActivity.execute({ id , name , date : parsedDate })
    
    return resp.status(200).json(activity)

  }catch(error){
    return resp.status(400).json({error : error.message})
  }
  

}) 

activitiesRouter.patch('/' , async(req ,resp ) => {

  try {
    
    const {id, done} = req.body;
  
    const updateActivity = new UpdateActivityDonePropertyService();
  
    const activity = await updateActivity.execute({id, done})

    return resp.status(200).json(activity)
  }
 catch(error){
   return resp.status(400).json({error : error.message})
 }


})


activitiesRouter.get('/' , async (req, resp) => {

  try {
    const activityRepository = getCustomRepository(ActivitiesRepository);


    const findActivities = await activityRepository.find({
      
      order: {
        name: 'ASC'
      }
    });

    return resp.json(findActivities).status(200)
  }catch(error) {
    return resp.status(400).json({error : error.message})
  }
  
})


activitiesRouter.get('/:name' , async (req, resp) => {

  try {
    const {name} = req.params
    const activityRepository = getCustomRepository(ActivitiesRepository);


    const findActivities = await activityRepository.find({
      name : Like(`%${name}%`),
      /* order: {
        name: 'ASC'
      } */
    });

    return resp.json(findActivities).status(200)
  }catch(error) {
    return resp.status(400).json({error : error.message})
  }
  
})


activitiesRouter.post('/' , async (req, resp) => {

  try {
  
  const {name, date , group_id} = req.body;

  const parsedDate = parseISO(date)

  const createActivity = new CreateActivityService();
    
  const activity = await createActivity.execute({
    name,
    date : parsedDate,
    group_id
  })

  return resp.status(201).json(activity)
  }
  catch(error){
    return resp.status(400).json({error : error.message})
  }
})

activitiesRouter.delete('/:id' , async (req , resp) => {

  try {
  const {id} = req.params;

  const activityRepository = getCustomRepository(ActivitiesRepository);


  const findActivity = await activityRepository.find({id})
    if(findActivity){
      await activityRepository.delete({id})
    }
  

  return resp.status(200).json(findActivity);

  }catch(error) {
    return resp.status(400).json({error : error.message})
  }
  
  
});
