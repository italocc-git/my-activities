import { createContext, useCallback, useContext, useState } from 'react'
import api from '../services/api'
import produce from 'immer'


interface ICardsProvider {
  children: React.ReactNode
}

interface SignInCredentials {
  email: string;
  password: string;
}

type User = {
  id:string;
  name:string;
  email:string;
  password:string;
  avatar:string;
}


type AuthState = {
  token : string;
  user: User;
}

//backend Interfaces

type IGroups = {
  id: string;
  name:string;
  
}

type IActivity = {
  id : string;
  name: string;
  group_id:string;
  date: string;
  date_formatted: string;
  done?: boolean;
  isLate?:boolean;
  group : IGroups
}

type DescriptionsTypeICard = {
  id:string;
  name:string;
  date : string;
  date_formatted?: string;
  done?: boolean;
  isLate?:boolean;
}
type ICard = {
  id: string;
  groupName: string;
  descriptions : DescriptionsTypeICard[]
}


interface ICardsContextData {
  cards: ICard[],
  dataUser : AuthState,
  setCards: (card : ICard[]) => void;
  createGroup: (groupName: string) => void;
  editGroupTitle: (groupId : string, groupName: string) => void;
  updateUser : (formData : User) => Promise<void>;
  searchActivity: (activityName : string ) => Promise<void>;
  deleteGroup : (groupId : string) => Promise<void>;
  deleteActivity: (activityId: string) => Promise<void>;
  createDescription: (descriptionName: string, date : Date, groupId: string) => void;
  editDescription: (activityId: string, descriptionName: string, date : Date,  ) => void;
  markAsDone: (activityId : string , done : boolean) => void;
  move: (fromList: number, toList: number, from: number, to: number) => void
  signIn(credentials : SignInCredentials) : Promise<void>
  signOut() : void;
  
}

const CardsContext = createContext({} as ICardsContextData)

export function CardsProvider({ children }: ICardsProvider) {


  const [cards, setCards] = useState<ICard[]>([])

  const [dataUser , setDataUser] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Activities:token');
    const userStorage = localStorage.getItem('@Activities:user');

    if(token && userStorage ){
      api.defaults.headers.authorization = `Bearer ${token}`
      return { token , user : JSON.parse(userStorage)}
    }
    else {
      return {} as AuthState
    }

  })

  async function signIn({email,password} : SignInCredentials) {
    
    const response = await api.post('sessions' , {
      email,
      password
    })
    console.log(response.data)
    const {token , user} = response.data

    localStorage.setItem('@Activities:token', token)
    localStorage.setItem('@Activities:user' , JSON.stringify(user))
    
   api.defaults.headers.authorization = `Bearer ${token}`
    setDataUser({token , user})
  }

  function signOut() {
    localStorage.removeItem('@Activities:token');
    localStorage.removeItem('@Activities:user')
    console.log('signOut')
    setDataUser({} as AuthState)
    setCards([]) //depois verificar isso, era p ser feito no momento do login
  }

  async function createGroup(groupName: string) {

    try {
      const {data} = await api.post('/groups' , {
        name : groupName,
        user_id : dataUser.user.id,
      });
      console.log(data)
     

     const response =  await api.post('/activities', {
        name:'Insira os dados do seu CARD',
        date: new Date(),
        group_id: data.id
      })
      

      //Pendencia de refatoração - 
      const groupsReq  = await api.get<IGroups[]>('/groups').then(response => response.data);

      const activitiesReq  = await api.get<IActivity[]>('/activities').then(response => response.data);

      const dataFormatted = groupsReq.map(group => ({
        id: group.id,
        groupName: group.name,
        descriptions : activitiesReq.filter(act => act.group.id === group.id ).map( activity => ({
          id: activity.id,
          name : activity.name,
          date : activity.date, 
          date_formatted : activity.date_formatted,
          isLate :  new Date(activity.date) < new Date(),
          done: activity.done,
        }))
      }))


      if(response){

         setCards(dataFormatted) 
       
      }
      else {
        console.log('Resposta do descriptions deu erro !')
      }
      

    }catch(error){
      console.log(error);
    }

  }

  async function deleteGroup(groupId : string ) {

    try {
      await api.delete(`/groups/${groupId}`);
      setCards(cards.filter(card => card.id !== groupId))
    }catch(error) {
      console.log(error);
    }
    
  }

  async function createDescription(descriptionName: string, date : Date, groupId: string) {


    try {
      const {data} = await api.post('/activities' , {
        name : descriptionName,
        date,
        done: false,
        group_id : groupId,
        
      })

      //Pendencia de refatoração - 
      const groupsReq  = await api.get<IGroups[]>('/groups').then(response => response.data);

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

      setCards(dataFormatted)
 


    }catch(error){
      console.log(error);
    }

  }

  async function editGroupTitle(groupId : string, groupName: string) {

    try {
      const {data} = await api.put(`/groups/${groupId}`, {
        name: groupName
      })

      //Pendencia de refatoração - 
      const groupsReq  = await api.get<IGroups[]>('/groups').then(response => response.data);

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
    
      setCards(dataFormatted) 
      
    }catch(error){
      console.log(error)
    }

  }

  async function editDescription(activityId: string, descriptionName: string, date : Date ) {

    try {
      const {data} = await api.put<IActivity>(`/activities/${activityId}` , {
        name : descriptionName,
        date: date,
      })


      
      //Pendencia de refatoração - 
      const groupsReq  = await api.get<IGroups[]>('/groups').then(response => response.data);

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

   
      setCards(dataFormatted)


      
    }catch (error){
      console.log(error)
    }

 
  }

  const updateUser = useCallback(async (userData :User) => {
    localStorage.setItem('@Activities:user' , JSON.stringify(userData))

    setDataUser({
      token : dataUser.token,
      user : userData
    }) 
  },[setDataUser,dataUser.token])

  async function searchActivity(activityName : string ){
    try {
      const {data} = await api.get<IActivity[]>(`/activities/${activityName}`);
      

      //Pendencia de refatoração - 
      const groupsReq  = await api.get<IGroups[]>('/groups').then(response => response.data);
/*
      const activitiesReq  = await api.get<IActivity[]>('/activities').then(response => response.data);
 */

      const dataFormatted = groupsReq.map(group => ({
        id: group.id,
        groupName : group.name,
        descriptions : data.filter(act => act.group.id === group.id).map(activity => ({
          id:activity.id,
          name : activity.name,
          date : activity.date, //A data(format Date) precisa ser formatada para padrão format DATE-FNS
          date_formatted : activity.date_formatted,
          isLate :  new Date(activity.date) < new Date(),
          done: activity.done,
        }))
      }))

     setCards(dataFormatted)


    }catch(error) {
      console.log(error);
    }
  }

  async function deleteActivity(activityId : string ) {

    try {
      await api.delete(`/activities/${activityId}`);
      

      //Pendencia de refatoração - 
      const groupsReq  = await api.get<IGroups[]>('/groups').then(response => response.data);

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

      setCards(dataFormatted)

    }catch(error) {
      console.log(error);
    }
    
  }

  async function markAsDone(activityId : string , done : boolean) {

     try {
      const {data} = await api.patch('/activities' , {
        id : activityId, 
        done
      } )
      console.log(data)

      

      setCards(cards.map(card => ({
        ...card ,
        descriptions : card.descriptions.map(desc => ({
          ...desc,
          done : desc.id === activityId ? data.done : desc.done,
        }))
      })))

      console.log(data)
    }catch(error) {
      console.log(error)
    } 
   

  }


  //DRAG N DROP

  async function move(fromList: number, toList: number, from: number, to: number) {
    console.log(from, to);
    console.log(fromList)
    //fromList => ID do grupo que o card foi selecionado
    //from => ID do card que está sendo arrastado
    const card = cards.map((card, indice ) => indice===fromList && card.descriptions.find((desc , index) => index === from)).filter(result => result !== false);
    console.log(card);
 /* 
 Solution BEFORE
    setCards(produce(cards, draft => {
      const dragged = draft[fromList].descriptions[from]; //Elemento que está sendo arrastado

      draft[fromList].descriptions.splice(from, 1)
      draft[toList].descriptions.splice(to, 0, dragged) //arrastado para a posição TO , será colocado antes dele
    })) */


    setCards(produce(cards, draft => {
      const dragged = draft[fromList].descriptions[from]; //Elemento que está sendo arrastado

      draft[fromList].descriptions.splice(from, 1)
      draft[toList].descriptions.splice(to, 0, dragged) //arrastado para a posição TO , será colocado antes dele
    }))












    /* 
    
        const findGroup = await cards.find(card => card.id === fromList)
    
        
        
        if (findGroup) {
    
       
          await api.put(`cards/${findGroup.id}`, {
            id: findGroup.id,
            groupName: findGroup.groupName,
            descriptions: findGroup.descriptions.filter((desc, index) => index !== from)
          })
    
    
          
          const findGroupTarget = await cards.find(card => card.id === toList)
    
           if (findGroupTarget) {
            await api.put(`cards/${findGroupTarget.id}`, {
              id: findGroupTarget.id,
              groupName: findGroupTarget.groupName,
              descriptions: findGroupTarget.descriptions.map((res, index) => res).splice(to, 0 , findGroup.descriptions[from]) /* index === to ? findGroup.descriptions[from] : res) 
            })
          } 
    
          
        }  
    
     */


  }



  return (
    <CardsContext.Provider value={{
      cards,
      setCards,
      dataUser,
      createGroup,
      editGroupTitle,
      deleteGroup,
      searchActivity,
      deleteActivity,
      editDescription,
      updateUser,
      
      createDescription,
      markAsDone,
      move,
      signIn,
      signOut,
      
    }}>
      {children}
    </CardsContext.Provider>
  )
}

export function useCards() {
  const context = useContext(CardsContext)

  return context;
}