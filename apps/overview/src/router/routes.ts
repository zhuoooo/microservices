import { RouteConfig } from 'vue-router';


export const routes: Array<RouteConfig> = [
    {
        path: '/index',
        name: 'index',
        component: () => import('../views/Index.vue')
    }
]