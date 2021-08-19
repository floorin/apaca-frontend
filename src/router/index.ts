import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/app',
    name: 'Home',
    component: Home,
  },
  {
    path: '/',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/restrictionat',
    name: 'AccesBlocat',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AccesBlocat.vue'),
  },
  {
    path: '/',
    name: 'PaginaInLucru',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/PaginaInLucru.vue'),
  },
  {
    path: '/status_numere',
    name: 'StatusNumere',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/StatusNumere.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Search/Search.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/reports',
    name: 'Reports',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Reports/Reports.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard/Dashboard.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/de_repartizat',
    name: 'DeRepartizat',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/DeRepartizat/DeRepartizat.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/second_step_intrare/:appid',
    props: true,
    name: 'SecondStepDocumentIntrare',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/SecondStepDocumentIntrare/SecondStepDocumentIntrare.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/view_document/:appid',
    props: true,
    name: 'ViewDocument',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ViewDocument/ViewDocument.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/intrare',
    name: 'Intrare',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Intrare/Intrare.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/iesire',
    name: 'Iesire',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Iesire/Iesire.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/intern',
    name: 'Intern',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Intern/Intern.vue'),
    meta: {
      requiresAuth: true
    }
  }
  ,
  {
    path: '/toate_repartizate',
    name: 'ToateRepartizate',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ToateRepartizate/ToateRepartizate.vue'),
    meta: {
      requiresAuth: true
    }
  }
  ,
  {
    path: '/nom_categ',
    name: 'NomCateg',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/NomCateg/NomCateg.vue'),
    meta: {
      requiresAuth: true
    }
  }
  ,
  {
    path: '/nom_tip_doc',
    name: 'NomTipDoc',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/NomTipDoc/NomTipDoc.vue'),
    meta: {
      requiresAuth: true
    }
  }
  ,
  {
    path: '/nom_registre',
    name: 'NomRegistre',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/NomRegistre/NomRegistre.vue'),
    meta: {
      requiresAuth: true
    }
  }
  ,
  {
    path: '/nom_departamente',
    name: 'NomDepartamente',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/NomDepartamente.vue'),
    meta: {
      requiresAuth: true
    }
  }
  ,
  {
    path: '/nom_users',
    name: 'NomUsers',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/NomUsers/NomUsers.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/logadmin',
    name: 'LogAdmin',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/LogAdmin/LogAdmin.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/params_scans',
    name: 'ParamsTypeFiles',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ParamsTypeFiles/ParamsTypeFiles.vue'),
    meta: {
      requiresAuth: true
    }
  },
  { path: '*', component: Home }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('statusAuth') == null) {
      next({
        path: '/restrictionat'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router;
