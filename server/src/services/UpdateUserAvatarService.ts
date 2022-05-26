import User from '../models/User'
import fs from 'fs'
import path from 'path'
import {getRepository} from 'typeorm'
import uploadConfig from '../config/upload'

interface Request {
  user_id : string;
  avatarFileName:string | undefined;
}

class UpdateUserAvatarService {
  public async execute({user_id , avatarFileName} : Request):Promise<User> {

    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if(!user){
      throw new Error('Only authenticated users can change Avatar')
    }
    if(user.avatar){
      // caso já tenha um avatar atualizado, esse procedimento irá substitui-lo

      const userAvatarFilePath = path.join(uploadConfig.directory , user.avatar); //user.avatar seria o avatar que já se encontra na pasta

      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath) //verificar se já existe avatar

      if(userAvatarFileExists){
        await fs.promises.unlink(userAvatarFilePath) //apaga o avatar
      }
    }
    
    if(avatarFileName){
      
      user.avatar = avatarFileName
    }
    

    await usersRepository.save(user)

    return user

  }
}

export default UpdateUserAvatarService