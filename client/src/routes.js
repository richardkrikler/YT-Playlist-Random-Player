import MainPage from './components/MainPage.vue'
import PlaylistPage from './components/PlaylistPage.vue'
import PlayerPage from './components/PlayerPage.vue'

export default [
    {
        name: 'PlaylistPage',
        path: '/playlist',
        component: PlaylistPage,
        props: true
    },
    {
        name: 'PlayerPage',
        path: '/player',
        component: PlayerPage,
        props: true
    },
    {
        name: 'default',
        path: '/',
        component: MainPage,
        props: true
    }
]