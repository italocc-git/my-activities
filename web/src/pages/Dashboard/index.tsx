import { useEffect} from 'react'
import styles from './dashboard.module.scss'
import { useCards } from '../../hooks/useCards'
import { useState } from 'react';
import { Group } from '../../components/Group'
import {Header} from '../../components/Header'
import api from '../../services/api'
import {useTheme } from '../../hooks/useTheme'

type IGroups = {
  id: string;
  name:string;
  
}

type IActivity = {
  id : string;
  name: string;
  date: string;
  date_formatted: string;
  done?: boolean;
  isLate?:boolean;
  group : {
    id:string;
    
  }
}


export const Dashboard = () => {
  const {theme , toogleTheme} = useTheme()
  const { cards, createGroup , setCards ,dataUser  } = useCards()


  
useEffect(() => {
  async function getCards(){
    
    const groupsReq  = await api.get<IGroups[]>(`/groups/${dataUser.user.id}`).then(response => response.data);

    const activitiesReq  = await api.get<IActivity[]>('/activities').then(response => response.data);

    
      const dataFormatted = groupsReq.map(group => ({
        id: group.id,
        groupName: group.name,
        descriptions : activitiesReq.filter(act => act.group.id === group.id ).map( activity => ({
          id: activity.id,
          name : activity.name,
          date : activity.date, //A data(format Date) precisa ser formatada para padrão format DATE-FNS
          date_formatted : activity.date_formatted,
          isLate :  new Date(activity.date) < new Date(),
          done: activity.done,
        }))
      }))

      console.log(dataFormatted)

      setCards(dataFormatted)
    
    
    
  }
  getCards()
},[dataUser.token])

  //create New group
  const [newGroup, setNewGroup] = useState('Novo grupo +')

  async function submitNewGroup(value: string) {

    if (value) {

      if(value=='Novo grupo +') return;

       createGroup(value) 
      setNewGroup('Novo grupo +')
    }
  }
  return (

    <div className={theme ==='dark' ? styles.dashboardContainerDarkMode : styles.dashboardContainerLightMode}>
      <Header/>
      <div className={styles.noGroup}>

        <input value={newGroup} onChange={({ target }) => setNewGroup(target.value)}
          onKeyPress={(event) => event.key === 'Enter' && submitNewGroup(event.currentTarget.value)} />

        
      </div>
      <button className={styles.buttonDark} onClick={toogleTheme}>
        {theme.toUpperCase()} Mode</button>
      <div className={styles.dashboardContent}>

          {cards.map((group, index) => (
            <Group key={group.groupName} data={group} groupIndex={index} />
          ))}
      
      </div>

    </div>
  )
}