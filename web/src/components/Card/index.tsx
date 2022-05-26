import {  useRef , useState  } from 'react'
import styles from './card.module.scss'
import { useCards } from '../../hooks/useCards'
import {  FiClock , FiTrash , FiEdit } from 'react-icons/fi'
import { useDrag, useDrop  } from 'react-dnd'
import { NewModalEditDescription } from '../newModalEditDescription';
import {NewModalDeleteDescription } from '../NewModalDeleteDescription'
type DescriptionsType = {
  id : string;
  name: string;
  date: string;
  date_formatted?: string;
  done?: boolean;
  isLate?: boolean;
}



interface CardProps {
  dataCard: DescriptionsType;
  indexCard: number;
  groupIndex: number; 
  /* handleOpenDescriptionModalEditMode: ( descriptionName: string) => void;
   */
}

export function Card({  dataCard, indexCard, groupIndex }: CardProps) {
  const [descriptionNameState, setDescriptionNameState] = useState('');
  const [isDescriptionModalOpenEditMode, setIsDescriptionModalOpenEditMode] = useState(false);

  const [isDescriptionModalOpenDeleteMode, setIsDescriptionModalOpenDeleteMode] = useState(false);

  const {  markAsDone , move , deleteActivity } = useCards()
  

  function handleCloseDescriptionModal() {
    
    setIsDescriptionModalOpenEditMode(false);
    setIsDescriptionModalOpenDeleteMode(false);
  }

  function handleOpenDescriptionModalEditMode( descriptionName: string) {
    
    setDescriptionNameState(descriptionName); //Description q eu cliquei
  
    setIsDescriptionModalOpenEditMode(true);
  }

  //DRAG IN DROP

  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, dragRef] = useDrag({
    type: 'CARD',
    item: {  indexCard , groupIndex },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const [, dropRef] = useDrop({
    accept:'CARD',
    hover(item : any, monitor) {
      
      //groups
      const draggedGroupIndex = item.groupIndex;
      const targetGroupIndex = groupIndex
      //cards

      const draggedIndex = item.indexCard;
      const targetIndex = indexCard;

      if(draggedIndex === targetIndex && draggedGroupIndex === targetGroupIndex) {
        return;
      }
      const targetSize = ref.current?.getBoundingClientRect() //tamanho do card
    
       if(targetSize) {
      
       const targetCenter  =  (targetSize.bottom - targetSize.top)/2

      const draggedOffset = monitor.getClientOffset();
      if(draggedOffset){
 
        const draggetTop = draggedOffset.y - targetSize.top;
        
        if(draggedIndex < targetIndex && draggetTop < targetCenter){
          return;
        }
  
        if(draggedIndex > targetIndex && draggetTop > targetCenter){
          return;
        }
      }

      move(draggedGroupIndex,targetGroupIndex,draggedIndex,targetIndex)

      item.indexCard = targetIndex
      item.groupIndex = targetGroupIndex;
      }

      
    }
  })

  dragRef(dropRef(ref))

  async function toogleDoneMark( activityId : string ) {
    //Chamar função markAsDone
    
    if (dataCard.done !== undefined) {
      markAsDone(activityId , dataCard.done)
    }
  }

  return (
      
        <div className={isDragging ?  styles.cardContentDragging : styles.cardContent } ref={ref} >
          
          <div className={styles.cardHeader}>
            <h3  >
              {dataCard.name}
            </h3>
            <div>
              <FiEdit  onClick={() => handleOpenDescriptionModalEditMode( dataCard.name)}/>
              <FiTrash onClick={() => setIsDescriptionModalOpenDeleteMode(true)} /> 
            </div>
            
          </div>
          <div className={styles.cardBody}>
            
            {dataCard.date && (
              
                  <div className={dataCard.isLate === true ? styles.cardDateUndone : dataCard.done ? styles.cardDateDone : styles.cardDate}>
                    <input type='checkbox' checked={dataCard.done} style={{cursor:'pointer'}}
                      onChange={() => toogleDoneMark(dataCard.id)} />
                    <FiClock size={16} />
                    
                    <span>{dataCard.date_formatted}</span>
                  </div>
                )}
          </div>

          <NewModalEditDescription activity={dataCard} 
            isOpen={isDescriptionModalOpenEditMode} onRequestClose={handleCloseDescriptionModal} />
          <NewModalDeleteDescription activity={dataCard} isOpen={isDescriptionModalOpenDeleteMode}
          onRequestClose={handleCloseDescriptionModal}/>

         </div>
 
  )
}