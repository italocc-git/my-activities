import Modal from 'react-modal'
import {FaRegWindowClose} from 'react-icons/fa'
import styles from './newModal.module.scss'
import { FormEvent, useState } from 'react'
import { useCards } from '../../hooks/useCards'

interface Activity {
  id : string;
  name: string;
  date: string;
  date_formatted?: string;
  done?: boolean;
  isLate?: boolean;
}

interface NewModalProps {
  isOpen: boolean;
  onRequestClose : () => void;
  activity : Activity;
  
  
}
export function NewModalEditDescription({isOpen, onRequestClose , activity } : NewModalProps) {
  
  const {name, date} = activity
  
  const {editDescription} = useCards();
  const [newHour , setNewHour] = useState('')
  const [newDate , setNewDate] = useState('');
  const [newDescription, setNewDescription] = useState(name ? name : '');
  
  async function handleEditDescription(event : FormEvent) {
    event.preventDefault();
    //Convert to Hours and minutes
    const newHourConvertted = newHour.split(':');
    console.log(newHourConvertted)
     const date = new Date(newDate);
     date.setHours(Number(newHourConvertted[0]));
     date.setMinutes(Number(newHourConvertted[1]));
     date.setDate(date.getDate()+1)
     
    
     console.log(date)

      editDescription(activity.id , newDescription, date )
   

    
    setNewDate('');
    setNewDescription('');
    onRequestClose();
  }

  return(
    <Modal
    overlayClassName='react-modal-overlay'
    className='react-modal-content'
    isOpen={isOpen} onRequestClose={onRequestClose}>
      <button className='react-modal-close-button' onClick={onRequestClose}>
        <FaRegWindowClose   />
      </button>


        <div className={styles.formContainer}>
            <form onSubmit={handleEditDescription}>
              <h2>Editar Atividade</h2>        
              <input placeholder='Digite o nome da atividade' value={newDescription}
              onChange={(event) => setNewDescription(event.currentTarget.value)} required
              className={styles.inputContainer} type='text' />
              <label htmlFor='data' >
                <h3>Data e Hora de início da Atividade </h3>
                </label>
                <div>
                <input required type='date' value={newDate} onChange={(event => setNewDate(event.target.value))} id='data' />
                <input required name='horario' type='time' value={newHour}  onChange={(event) => setNewHour(event.target.value)}/>
                </div>
                
              
              
              
              <button type='submit'>Salvar</button>
          </form>
        </div>
      
        
    </Modal>
  )
}