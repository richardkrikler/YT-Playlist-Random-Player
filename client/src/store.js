export const BASE_URL = 'http://localhost:2001/'

export default {
    state: {
        save: {
            currentPlaylist: null,
            videoId: null
        }
    },

    actions: {
        save() {
            localStorage.setItem('save', JSON.stringify(this.state.save))
        }
    }
}