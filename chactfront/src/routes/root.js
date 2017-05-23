import Root from 'containers/Root'
import Main from 'containers/Root/Main'

import JoinGroup from '../components/Views/JoinGroup'
import GroupChact from '../components/Views/GroupChact'
import Information from '../components/Views/Information'
export default {
    path: '/',
    component: Root,
    indexRoute: {
      component: Main
    },
    childRoutes:[{
      component: Main,
      childRoutes: [{
          path: 'group',
          component: JoinGroup
      }, {
          path: 'chact/:id',
          component: GroupChact
      }, {
          path: 'info',
          component: Information
      }]
    }]
}
