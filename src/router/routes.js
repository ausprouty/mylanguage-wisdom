
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'International',
        path: '/test',
        component: () => import('src/pages/InternationalTest.vue')
      },
      {
        name: 'RestorePage',
        path: '/restore',
        component: () => import('src/pages/RestorePage.vue')
      },
      {
        name: 'Index',
        path: '/index',
        component: () => import('pages/IndexPage.vue')
      },
      {
        name: 'MountainOfGod',
        path: '/mountain',
        component: () => import('pages/MountainOfGod.vue')
      },
      {
        name: 'Karma',
        path: 'karma',
        component: () => import('src/pages/KarmaContent.vue')
      },{
        name: 'Deepalavi',
        path: '/deepavali',
        component: () => import('src/pages/DeepavaliContent.vue')
      },
      {
        name: 'BirthofGuru',
        path: '/birth',
        component: () => import('pages/BirthOfGuru.vue')
      },
      {
        name: 'HisLife',
        path: '/life/:lessonLink?/:languageCode?',
        component: () => import('src/pages/HisLife.vue')
      },
      {
        name: 'HisTeachings',
        path: '/teachings/:lessonLink?/:languageCode?',
        component: () => import('pages/HisTeachings.vue')
      },
      {
        name: 'HisBook',
        path: '/book/:lessonLink?/:languageCode?',
        component: () => import('pages/HisBook.vue')
      },

    {
      name: 'FollowingHim',
      path: '/following/:lessonLink?/:languageCode?',
      component: () => import('pages/FollowingHim.vue')
    },
    {
      name: 'LeadershipTeachings',
      path: '/leadership/:lessonLink?/:languageCode?',
      component: () => import('pages/LeadershipTeachings.vue')
    },
    {
      name: 'AskHisFollowers',
      path: '/questions',
      component: () => import('src/pages/RestorePage.vue')
    },
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
