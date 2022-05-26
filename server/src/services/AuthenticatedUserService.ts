import User from '../models/User'
import {getRepository} from 'typeorm'
import {compare} from 'bcrypt'
import {sign} from 'jsonwebtoken'
import {jwt} from '../config/auth'
interface Request {
  email:string;
  password: string;
}
interface Response {
  user : User;
  token: string;
}

class AuthenticatedUserService {
  
  public async execute({email,password}: Request) : Promise<Response>{
    
  const usersRepository =  getRepository(User);

  const user = await usersRepository.findOne({where : {email: email}})
 

  if(!user){
    throw new Error('Incorrect User/Password , try again')
  }
  
  
  const passwordMatched = await compare(password, user.password)

  if(!passwordMatched) { 
    throw new Error('Incorrect User/Password , try again')
  }
  const token = sign({}, jwt.secret, {
    expiresIn: jwt.expireIn,
    subject: user.id
  })

  return {
    user,
    token
  }

  }
}

export default AuthenticatedUserService