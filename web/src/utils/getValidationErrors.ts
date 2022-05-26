import {ValidationError} from 'yup'

interface Errors {
  [chave : string] : string;
}

export const getValidationErrors = (error : ValidationError) : Errors => {

  const validationErrors : Errors = {}

 error.inner.forEach(error => {
   if(error.path){
    validationErrors[error.path] = error.message
   }
   
 })

 return validationErrors;
}