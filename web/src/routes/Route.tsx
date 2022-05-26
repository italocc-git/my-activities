import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect
} from 'react-router-dom'

import {useCards } from '../hooks/useCards'

interface RouteProps extends ReactDOMRouteProps {
  isPrivate ?: boolean;
  component : React.ComponentType;
}

const Route:React.FC<RouteProps> =({isPrivate = false, component: Component, ...rest}) => {
  const { dataUser }  = useCards()
  
  return (
    <ReactDOMRoute {...rest}
    render= { ({location}) => {
      
      return isPrivate === !!dataUser.user ?
      ( <Component /> ) :
      ( <Redirect to={ {pathname : isPrivate ? '/' : 'dashboard' , state : {from : location}} } />)
            }
  } />


  )
}

export default Route;

