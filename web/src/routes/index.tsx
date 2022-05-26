
import {Switch } from 'react-router-dom'
import Route from './Route'

import {SignIn} from '../pages/SignIn'
import {SignUp} from '../pages/SignUp'
import {Dashboard} from '../pages/Dashboard'
import { Profile } from '../pages/Profile'


const Routes = () => {
  return(
    <Switch>
      <Route path='/' exact component={SignIn} />
      <Route path='/signup' component={SignUp} />
      <Route path='/dashboard' exact component={Dashboard} isPrivate={true}/>
      <Route path='/profile' component={Profile} isPrivate />
    </Switch>
    
  )
}

export default Routes