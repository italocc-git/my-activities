import {Request, Response, NextFunction} from 'express'

import {verify} from 'jsonwebtoken'
import {jwt} from '../config/auth'

interface TokenPayload {
  iat : number;
  exp: number;
  sub : string;
}

export default function ensureAuthenticated(request : Request,resp : Response,next : NextFunction){

  const authHeader = request.headers.authorization; //Pegando o token da requisição

  if(!authHeader){
    throw new Error('JWT is missing');

  }

  const [type, token] = authHeader.split(' ');

  try {
    const decoded  = verify(token , jwt.secret)

    console.log(decoded);
  
    const {sub}  = decoded as TokenPayload

    request.user = {
      id: sub
    }

    next()
  }
  catch(error) {
    throw new Error('invalid JWT token');
  }
}