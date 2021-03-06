// System
import Vue from 'vue'
import Router from 'vue-router'

// Layout
import Body from '@/components/Layout/Body'
import Header from '@/components/Layout/Header'

// Body
import Index from '@/components/Body/Index'
import Scoreboard from '@/components/Body/Scoreboard'
import Mytask from '@/components/Body/Mytask'

import { mapState, mapMutations } from 'vuex'
import firebase from 'firebase'

// Admin
import Admin from '@/components/Backend/Admin'
import adminUser from '@/components/Backend/AdminUser'
import adminTask from '@/components/Backend/AdminTask'

// Course
import Aracde from '@/components/Course/Aracde'
import Challenges from '@/components/Course/Challenges'
import Practice from '@/components/Course/Practice'
import Tournaments from '@/components/Course/Tournaments'

import PracticeTask from '@/components/Course/PracticeTask'

Vue.use(Router)
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      components: {
        header: Header,
        body: Body
      },
      children: [
        { path: '/', component: Index, name:'index' },
        { path: '/scoreboard', component: Scoreboard, name: 'scoreboard', meta: { requiresAuth: true} },
        { path: '/mytask', component: Mytask, name: 'mytask', meta: { requiresAuth: true} },
        { path: '/admin', component: Admin, name: 'admin', meta: { requiresAuth: true, requiresAdmin: true}, children: 
          [
            { path: 'user', component: adminUser, name: 'adminUser', meta: { requiresAdmin: true} },
            { path: 'task', component: adminTask, name: 'adminTask', meta: { requiresAdmin: true} }
          ]
        },
        { path: '/practice', component: Practice, name: 'practice', meta: { requiresAuth: true} },
        { path: '/practice/:taskId', component: PracticeTask, name: 'practiceTask', meta: { requiresAuth: true } },
        { path: '/practice', component: Challenges, name: 'challenges', meta: { requiresAuth: true} },
        { path: '/practice', component: Tournaments, name: 'tournaments', meta: { requiresAuth: true} },
        { path: '/practice', component: Aracde, name: 'aracde', meta: { requiresAuth: true} },
      ],
    }
  ],
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    firebase.auth().onAuthStateChanged( function(user) {
      if (user) {
        next()
      } else { next({ path: '/' }) }
    })
  } else if (to.matched.some(record => record.meta.requiresAdmin)) {
    firebase.auth().onAuthStateChanged( function(user) {
      if (user.permission > 2) {
        next()
      } else { next({ path: '/' }) }
    })
  } else {
    next()
  }
})

// router.beforeEach((to, from, next) => {
//   mapMutations(['auth'])
//   next()
// })
export default router