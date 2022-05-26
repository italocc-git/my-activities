import { useCallback, useRef} from 'react'
import styles from './signup.module.scss'
import  * as Yup from 'yup'
import {FiUser, FiMail, FiLock} from 'react-icons/fi'
import {Input} from '../../components/Input'
import {Form} from '@unform/web';
import {getValidationErrors} from '../../utils/getValidationErrors'
import { FormHandles } from '@unform/core';
import { Link , useHistory} from 'react-router-dom'
import api from '../../services/api'
import { ToastContainer, toast } from 'react-toastify';


type dataForm = {
  name : string;
  email:string;
  password:string;
}

export function SignUp() {
  const history = useHistory(); 
 const formRef = useRef<FormHandles>(null)

  const handleSubmit = useCallback( async (data : dataForm) =>{
    
    try {
      const schema = Yup.object().shape({
        name : Yup.string().required('Nome Obrigatório'),
        email: Yup.string().required('Email Obrigatório').email('Formato de e-mail inválido'),
        password: Yup.string().min(6 , 'No mínimo 6 dígitos')
      })
      await schema.validate(data , {
        abortEarly:false,
      })

      await api.post('/users' , data);
      toast.success('Cadastro realizado com sucesso !')
      
      alert(`${data.name} Cadastrado com sucesso`);
      history.push('/');

      console.log(data)
    }catch(error) {
      if(error instanceof Yup.ValidationError){
        const errors = getValidationErrors(error);
        
        formRef.current?.setErrors(errors);
        
      }
    }
    
  },[])
  

  return(
    <>
    <div className={styles.Container}>
      <div className={styles.Content}>
        <Form ref={formRef} onSubmit={handleSubmit} >
          <label htmlFor='name'>Nome :</label>
          <Input icon={FiUser} name='name' id='name' placeholder='Digite o seu nome'/>
          <label htmlFor='email' > E-mail :</label>
          <Input icon={FiMail} name='email' id='email' placeholder='Digite o seu email' />
          <label htmlFor='pass' > Senha :</label>
          <Input icon={FiLock} name='password' id='pass' type='password' placeholder='Digite sua senha' />
          <button type='submit'>Cadastrar</button>
          
        </Form>
        <Link to='/' > Voltar para logon </Link>
      </div>
    </div>
    <ToastContainer position={'top-center'}  
    autoClose={3000} draggable closeOnClick hideProgressBar={false}
    className={styles.toastContainer} />
    </>
  )
}