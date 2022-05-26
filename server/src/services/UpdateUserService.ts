import User from '../models/User'
import {compare  , hash} from 'bcrypt'
import {getRepository} from 'typeorm'

interface Request {
  user_id : string;
  name:string ;
  new_password:string;
}

class UpdateUserAvatarService {
  public async execute({user_id , name, new_password} : Request):Promise<User> {

    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if(!user){
      throw new Error('User not found')
    }
    
    if(new_password) {
      const checkOldPass = await compare(new_password , user.password );
    

    if(checkOldPass){
      throw new Error('The password is the old one, try another')
    }
  }
    user.name = name;
    user.password = await hash(new_password ,8 )
    await usersRepository.save(user)


    return user

  }
}

export default UpdateUserAvatarService