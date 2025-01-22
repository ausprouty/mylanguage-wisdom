const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [

      {
        name: "Index",
        path: "/index",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        name: "SourceOfWisdom",
        path: "/life/:lessonLink?/:languageCode?",
        component: () => import("src/pages/SourceOfWisdom.vue"),
      },
      {
        name: "HisWisdom",
        path: "/wisdom/:lessonLink?/:languageCode?",
        component: () => import("src/pages/HisWisdom.vue"),
      },
      {
        name: "GrandStory",
        path: "/grand/:lessonLink?/:languageCode?",
        component: () => import("src/pages/GrandStory.vue"),
      },
      
      {
        name: "AskHisFollowers",
        path: "/questions",
        component: () => import("src/pages/RestorePage.vue"),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
