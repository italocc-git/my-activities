import styles from './profile.module.scss'
import {ChangeEvent, useRef} from 'react'
import { FormHandles } from '@unform/core';
import {Form} from '@unform/web'
import { FiLock, FiUser , FiArrowLeft, FiCamera} from 'react-icons/fi'
import {Input} from '../../components/Input'
import { Link , useHistory } from 'react-router-dom';
import { useCards } from '../../hooks/useCards';
import * as Yup from 'yup'
import api from '../../services/api'
import {getValidationErrors} from '../../utils/getValidationErrors'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface FormData {
  name:string;
  password:string;
  password_confirmation:string;
}




export const Profile = () => {
  const formRef = useRef<FormHandles>(null)
  const { dataUser , updateUser } = useCards()
  
  const {push} = useHistory()
  const {user} = dataUser

  const handleSubmit = async(data : FormData) => {
    try {
      const schema = Yup.object().shape({
        name : Yup.string().required('Nome obrigatório'),
        password: Yup.string().min(6,'No mínimo 6 dígitos'),
        password_confirmation : Yup.string().oneOf([Yup.ref('password')], 'Confirmação incorreta')
      })
  
      await schema.validate(data ,{
        abortEarly:false,
      }) 
      const response = await api.put('/profile', data)
      await updateUser(response.data)

      toast.success('Usuário alterado com sucesso');
      setTimeout(() => {
        push('/dashboard')
      
      },3000);
      //Mandar usuário para a dashboard
    }catch(error){
      if(error instanceof Yup.ValidationError){
        const errors = getValidationErrors(error);
        
        formRef.current?.setErrors(errors);
        
      }
      toast.error('Erro ao editar os dados, verifique os campos preenchidos')
    }
  }
   
  const handleAvatarChange = async(event : ChangeEvent<HTMLInputElement>) => {
    
    if(event.target.files){
      console.log(event.target.files[0]);


      const data = new FormData();
      data.append('avatar', event.target.files[0]);

      const user = await api.patch('/users/avatar', data)

      await updateUser(user.data);
      toast.success('avatar editado com sucesso');
     /*  setTimeout(() => {
        push('/dashboard')
      
      },3000); */
    }
  } 

  return (
    <div className={styles.Container}>
      

      <div className={styles.Content}>
        
        <header>
        <Link to='/dashboard'>
            <FiArrowLeft />
          </Link>
          <h1>Editar Perfil</h1>
          
          
      </header>
        <Form className={styles.formContainer} initialData={{name : user.name}} 
        ref={formRef} onSubmit={handleSubmit}>

          {/* Avatar input */}
          <div className={styles.avatarContainer}>
            <img src={`http://localhost:3333/files/${user.avatar}`} alt={user.name} />
            <label htmlFor='avatar'>
              <FiCamera/>
              <input id='avatar' type='file' onChange={handleAvatarChange} />
            </label>

          </div>

          <label htmlFor='name'>Nome :</label>
          <Input icon={FiUser} name='name' id='name' type='text'  />
          <label htmlFor='pass'>Senha :</label>
          <Input icon={FiLock} name='password' id='pass' type="password"  />
          <label htmlFor='confPass'>Confirme sua Senha :</label>
          <Input icon={FiLock} name='password_confirmation' id='confPass' type="password"  />
         
          <button type='submit'>Editar Dados </button>
         
        </Form>
        <ToastContainer position={'top-right'}  
    autoClose={3000} draggable closeOnClick hideProgressBar={false}
     />
      </div>

    </div>
  )
}