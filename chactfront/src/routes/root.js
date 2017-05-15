import Root from 'containers/Root'
import Main from 'containers/Root/Main'

import JoinGroup from '../components/Views/JoinGroup'
import Chact1 from '../components/Views/Chact1'
import Chact2 from '../components/Views/Chact2'
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
          path: 'chact1',
          component: Chact1
      }]
    }]
}
