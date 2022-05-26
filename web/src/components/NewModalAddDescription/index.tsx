import Modal from 'react-modal'
import {FaRegWindowClose} from 'react-icons/fa'
import styles from './newModal.module.scss'
import { FormEvent, useState } from 'react'
import { useCards } from '../../hooks/useCards'

type CardsData = {
  id: string;
  groupName: string;
  descriptions: object;
}

interface NewModalProps {
  isOpen: boolean;
  onRequestClose : () => void;
  group : CardsData;
  
}

export function NewModalAddDescription({isOpen, onRequestClose  , group} : NewModalProps) {
  const {createDescription } = useCards();

  const [newDescription, setNewDescription] = useState('');
  
  async function handleCreateDescription(event : FormEvent) {
    event.preventDefault();

      createDescription(newDescription , new Date() ,group.id)
    
      setNewDescription('')
    
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
          <form onSubmit={handleCreateDescription}>
            <h1 >Grupo {group.groupName}</h1>
            <h2>Cadastrar Atividade</h2>        
            <input placeholder='Digite o nome da atividade' value={newDescription}
            onChange={(event) => setNewDescription(event.currentTarget.value)} 
            className={styles.inputContainer} type='text' />
            
            <button type='submit'>Salvar</button>
          </form>
        </div>
      
        
    </Modal>
  )
}