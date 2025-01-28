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
        path: "/source/:lessonLink?/:languageCode?",
        component: () => import("src/pages/SourceOfWisdom.vue"),
      },
      {
        name: "HisWisdom",
        path: "/wisdom/:lessonLink?/:languageCode?",
        component: () => import("src/pages/HisWisdom.vue"),
      },
      {
        name: "GrandStory",
        path: "/storyOld/:lessonLink?/:languageCode?",
        component: () => import("src/pages/GrandStory.vue"),
      },
      {
        name: "GrandStoryInteractive",
        path: "/story/:lessonLink?/:languageCode?",
        component: () => import("src/pages/GrandStoryInteractive.vue"),
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
