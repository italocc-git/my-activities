import { Card } from '../Card';
import styles from './group.module.scss'
import { useCards } from '../../hooks/useCards'
import {  useState } from 'react';
import {FiTrash} from 'react-icons/fi'
import Modal from 'react-modal'
import { NewModalAddDescription } from '../NewModalAddDescription';

type DescriptionsType = {
  id : string;
  name: string;
  date: string;
  date_formatted?: string;
  done?: boolean;
  isLate?: boolean;
}

type CardsData = {
  id: string;
  groupName: string;
  descriptions: DescriptionsType[];
}

interface IGroupProps {
  data: CardsData;
  groupIndex: number;
}

//


Modal.setAppElement('#root');
export const Group = ({ groupIndex, data }: IGroupProps) => {


  const {  editGroupTitle , deleteGroup } = useCards()

  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  

 
  function handleOpenDescriptionModal(groupName: string) {
    //setGroupNameState(groupName);

    setIsDescriptionModalOpen(true)

  }

  const [nameState, setNameState] = useState(data.groupName);

  async function submitNewGroupTitle(groupNewName: string) {

    if(groupNewName.trim().length === 0){
      alert('Campo de texto não pode ficar em branco');
      setNameState(data.groupName)
      return;
    }

    if (data.id) {
      alert(`${groupNewName} alterado !`)
      await editGroupTitle(data.id, groupNewName);
      
    }
  }
  function handleCloseDescriptionModal() {
    setIsDescriptionModalOpen(false);
    
  }

  return (

    <div className={styles.groupContainer}>

      <div className={styles.boardHeader} >
        <input value={nameState} onChange={({ target }) => setNameState(target.value)}
          onKeyPress={(event) => event.key === 'Enter' && submitNewGroupTitle( event.currentTarget.value)}
        />

       <FiTrash onClick={() => deleteGroup(data.id)} /> 


      </div>


      <div className={styles.board}>
        <div  >
          {data.descriptions.map((card, indice) => (

            <Card  key={indice}
               dataCard={card} indexCard={indice} groupIndex={groupIndex}
              /* handleOpenDescriptionModalEditMode={handleOpenDescriptionModalEditMode} */
               />

          ))}

          <NewModalAddDescription  isOpen={isDescriptionModalOpen}
            onRequestClose={handleCloseDescriptionModal} group={data} />

          
        </div>
        <div className={styles.newCardButton}>

          <button onClick={() => handleOpenDescriptionModal(data.groupName)}>Nova Atividade +</button>
        </div>
      </div>

    </div>
  )
}