import styles from './header.module.scss'
import { MdNotifications , MdSearch  } from "react-icons/md";
import { AiOutlinePoweroff } from "react-icons/ai";
import { useCards } from '../../hooks/useCards';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { FormEvent, useState } from 'react';



export function Header () {
  const { cards , signOut , searchActivity , dataUser} = useCards();

  const {user} = dataUser
  const [activity, setActivity] = useState('')

  async function searchCards (event : FormEvent) {
    event.preventDefault();

    if(activity.trim().length === 0){
      toast.info('Por favor insira os dados para buscar')
      setActivity('');
    }
    await searchActivity(activity)
  }

  function showNotifications(){
   

   try {
    const  quantityLateActivities= cards.map(card => card.descriptions.reduce((acc, description) => {
    
      if(description.isLate == true){
        
        return ++acc;
      } 
      return acc;
     },0 )).filter(result => result!==0).reduce((acc , current) => current + acc )
     
     
      toast.error(`${quantityLateActivities} atividades atrasadas !`)
   }catch(error){
    toast.info('Nenhuma atividade atrasada')
    console.log(error)
   }
   
   
  }

  return(
    <>
    <header className={styles.header}>
      <form onSubmit={searchCards} className={styles.inputContainer} >
        <input type="text" name="localizar" value={activity}
         placeholder='Localizar Atividade' onChange={(e) => setActivity(e.target.value)}/>
        <button type='submit'>
          <MdSearch/>
        </button>
      </form>
      <div className={styles.profile}>
        <img src={`http://localhost:3333/files/${user.avatar}`}/>
        <Link to='/profile' > 
          <span>Bem vindo ,</span>
          <span>{user.name}</span>
        </Link>
        <MdNotifications onClick={showNotifications} className={styles.icons} />
      </div>
     
      <AiOutlinePoweroff className={styles.icons}  onClick={signOut}>SignOut</AiOutlinePoweroff>

      
    </header>
    <ToastContainer position={'top-right'}  
    autoClose={3000} draggable closeOnClick hideProgressBar={false}
    className={styles.toastContainer} />
    </>
  )
}