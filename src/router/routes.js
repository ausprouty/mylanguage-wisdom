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
        name: "JesusVideoMaster",
        path: "/video/:lesson?/:languageCodeHL?",
        component: () => import("src/pages/JesusVideoMaster.vue"),
      },

      {
        name: "SeriesMaster",
        path: "/wisdom/:series/:study?/:lesson?/:languageCodeHL?",
        component: () => import("src/pages/SeriesMaster.vue"),
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
