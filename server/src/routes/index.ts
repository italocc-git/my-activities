import {Router} from 'express'
import {activitiesRouter} from './activities.routes'
import {usersRouter} from './users.routes'
import {groupsRouter} from './groups.routes'
import {sessionsRouter} from './sessions.routes'
import {profileRouter} from './profile.routes'
const routes = Router();

routes.use('/activities' , activitiesRouter)
routes.use('/users' , usersRouter)
routes.use('/profile' , profileRouter)
routes.use('/groups' , groupsRouter)
routes.use('/sessions' , sessionsRouter)


export default routes;