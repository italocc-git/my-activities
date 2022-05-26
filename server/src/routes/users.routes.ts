import { Request,Router} from 'express'
import CreateUserService from '../services/CreateUserService'
import multer from 'multer'
import uploadConfig from '../config/upload'
import UpdateUserAvatarService from '../services/UpdateUserAvatarService'
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
export const usersRouter = Router();

const upload = multer(uploadConfig)

usersRouter.post('/' , async (req, resp) => {

  try {
  const {name, email, password} = req.body;
   
  const createUser = new CreateUserService();

  const user = await createUser.execute({name,email,password})
  
  const userWithoutPassword = {
    id : user.id,
    name : user.name,
    email : user.email,
    createAt : user.created_at,
    updateAt : user.updated_at
  }

  

  return resp.status(201).json(userWithoutPassword)
  }
  catch(error){
    return resp.status(400).json({error : error.message})
  }
})



usersRouter.patch('/avatar' , ensureAuthenticated , upload.single('avatar') , async(req : Request,resp) => {
  

  try {
    const updateUserAvatar = new UpdateUserAvatarService()

    
      const user = await updateUserAvatar.execute({
        user_id : req.user.id,
        avatarFileName : req.file?.filename
      })
      
      return resp.status(200).json(user)
    
 
  }
  catch(error){
    return resp.status(400).json({error : error.message})
  }

})
