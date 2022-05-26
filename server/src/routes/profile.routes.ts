import { Router } from 'express'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import UpdateUserProfile from '../services/UpdateUserService'
export const profileRouter = Router();

profileRouter.use(ensureAuthenticated);

profileRouter.put('/' ,  async(req,resp) => {
  
  try {
  const user_id = req.user.id;

  const {name, password} = req.body

  const updateProfile = new UpdateUserProfile()

  const user = await updateProfile.execute({user_id, name, new_password : password})

  return resp.status(200).json(user);

  
  }catch(error){
    return resp.status(400).json({error : error.message})
  }}
  
)