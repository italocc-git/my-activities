import styles from './signin.module.scss'
import {Form} from '@unform/web'
import {useCallback , useRef} from 'react'
import  * as Yup from 'yup'
import {getValidationErrors} from '../../utils/getValidationErrors'
import { FormHandles } from '@unform/core';
import {FiMail, FiLock} from 'react-icons/fi'
import {Input} from '../../components/Input'
import {useCards} from '../../hooks/useCards'
import { Link , useHistory} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
  email:string;
  password:string;
}

export function SignIn() {
  const formRef = useRef<FormHandles>(null)
  const {signIn} = useCards()
  const history = useHistory()


  
  const handleSubmit = useCallback( async (data : FormData) =>{
    
    try {
      const schema = Yup.object().shape({
        email: Yup.string().required('Email Obrigatório').email('Formato de e-mail inválido'),
        password: Yup.string().min(6 , 'No mínimo 6 dígitos')
      })
      await schema.validate(data , {
        abortEarly:false,
      })

      await signIn({
        email : data.email,
        password : data.password
      });

      history.push('/dashboard');
      console.log(data)
    }catch(error) {
      if(error instanceof Yup.ValidationError){
        const errors = getValidationErrors(error);
        
        formRef.current?.setErrors(errors);
        
      }
      toast.warning(`Erro ao fazer login , cheque as credenciais !`)
   
    }
    
  },[])
  return(
    <div className={styles.container}>
           
        <div className={styles.content}>
          <h1>Activities App</h1>
          <Form ref={formRef} onSubmit={handleSubmit}>
          <label htmlFor='email'>E-mail :</label>
          <Input icon={FiMail} name='email' id='email' type='text'  placeholder='Digite o seu email' />
          <label htmlFor='pass'>Senha :</label>
          <Input icon={FiLock} name='password' id='pass' type="password" placeholder='Digite a sua senha' />
          <button type='submit'>Entrar </button>
          </Form>
          <Link to='/signup' >Criar Conta </Link>
        </div>
        <ToastContainer position={'top-center'}  
    autoClose={3000} draggable closeOnClick hideProgressBar={false}
     />
      
    </div>
  )
}