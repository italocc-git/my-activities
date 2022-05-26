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

export function NewModalDeleteDescription({isOpen, onRequestClose  , activity} : NewModalProps) {
  const { deleteActivity} = useCards();

  
  
  async function handleDeleteDescription(event : FormEvent) {
    event.preventDefault();

    deleteActivity(activity.id)

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
          <form onSubmit={handleDeleteDescription}>
            <h2>Deletar Atividade</h2>        
            
            <p>Tem certeza que deseja apagar a atividade <b>{activity.name}</b> ?</p>
            <button type='submit'>Apagar</button>
            <button type='button' className={styles.cancelButton} onClick={onRequestClose}>Cancelar</button>
          </form>
        </div>
      
        
    </Modal>
  )
}