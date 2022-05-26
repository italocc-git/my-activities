import { Router } from 'express'
import AuthenticatedUserService from '../services/AuthenticatedUserService'
export const sessionsRouter = Router();


sessionsRouter.post('/' , async (req, resp) => {

  try {
  
  const {email, password } = req.body;
  
  const authenticateUser = new AuthenticatedUserService();

  const { user , token } = await authenticateUser.execute({email, password})  

  console.log(user)
  /* const userWithoutPassword = {
    id : user.id,
    name : user.name,
    email : user.email,
    createAt : user.created_at,
    updateAt : user.updated_at
  } */
  return resp.status(200).json({user , token})
  }
  catch(error){
    return resp.status(400).json({error : error.message})
  }
})
