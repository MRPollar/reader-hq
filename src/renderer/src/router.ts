import { createMemoryHistory, createRouter, RouterView } from "vue-router";

const router = createRouter({
    history: createMemoryHistory(),
    routes:[
        {
            path: "",
            name: "home",
            component: () => import("./views/HomePage.vue"),
        },
        {
            path: "/download/:slug",
            name: "download",
            component: () => import("./views/DownloadPage.vue"),
            props: true
        },
        {
            path: "/update/:slug",
            name: "update",
            component: () => import("./views/UpdatePage.vue"),
            props: true
        },
        {
            path: "/file",
            name: 'baixados',
            component: () => import("./views/FilesPage.vue"),
        },
        {
            path: "/file/:site",
            name: 'site',
            component: () => import ("./views/SitePage.vue"),
            props:true
        },
        {
            path: "/file/:site/:name",
            name: "story",
            component: () => import("./views/StoryPage.vue"),
            props: true
        },
        {
            path: "/file/:site/:name/:chapter",
            name: 'chapter',
            component: () => import("./views/ChapterPage.vue"),
            props: true
        }


    ]
})

export default router