import Root from 'containers/Root'
import Main from 'containers/Root/Main'

import JoinGroup from '../components/Views/JoinGroup'
import Chact from '../components/Views/Chact'
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
          path: 'chact',
          component: Chact
      }]
    }]
}
