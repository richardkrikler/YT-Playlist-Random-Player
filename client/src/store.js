import axios from 'axios'

export const BASE_URL = 'http://localhost:2001/'

export default {
    state: {
        save: {
            currentPlaylist: null,
            videoId: null,
            autoplay: true
        }
    },


    actions: {
        save() {
            localStorage.setItem('save', JSON.stringify(this.state.save))
        },

        async playRandomVideo({state, dispatch}) {
            await axios.get(BASE_URL + 'randomVideo/' + state.save.currentPlaylist.id)
                .then(res => {
                    state.save.videoId = res.data
                    dispatch('save')
                })
        }
    }
}