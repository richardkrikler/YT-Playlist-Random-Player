<template>
  <div class="flex flex-col gap-16 px-3">
    <div class="flex gap-3 justify-center">
      <button-element text="Authenticate" v-if="!authenticated" @click="authenticate"/>
      <button-element text="Logout" v-if="authenticated" @click="logout"/>
      <button-element text="Reload Playlists" v-if="authenticated" @click="reloadPlaylists"/>
    </div>

    <table
        v-if="authenticated && playlists"
        class="border-collapse w-full border border-slate-500 bg-slate-800 text-sm shadow-sm">
      <thead class="bg-slate-700">
      <tr>
        <th class="w-1/2 border border-slate-600 font-semibold p-4 text-slate-200 text-left">
          Name
        </th>
        <th class="w-1/2 border border-slate-600 font-semibold p-4 text-slate-200 text-left">
          Videos
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="pl in playlists" :key="pl.id" @click="openPlaylist(pl)"
          class="cursor-pointer hover:bg-slate-500 active:bg-slate-600 text-slate-400 hover:text-slate-900 select-none">
        <td class="border border-slate-700 p-4">
          {{ pl.snippet.title }}
        </td>
        <td class="border border-slate-700 p-4">
          {{ pl.contentDetails.itemCount }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
import {BASE_URL} from '../store'
import ButtonElement from './ButtonElement.vue'

export default {
  name: 'MainPage',

  components: {
    ButtonElement
  },

  data() {
    return {
      authenticated: false,
      playlists: null
    }
  },

  methods: {
    async isAuthenticated() {
      await axios.get(BASE_URL + 'authenticated')
          .then(res => {
            this.authenticated = res.data
            if (this.authenticated) {
              this.getPlaylists()
            }
          })
    },

    async authenticate() {
      await axios.get(BASE_URL + 'authUrl')
          .then(res => window.location.replace(res.data))
    },

    async logout() {
      await axios.get(BASE_URL + 'logout')
          .then(() => this.authenticated = false)
    },

    async getPlaylists() {
      await axios.get(BASE_URL + 'playlists')
          .then(res => this.playlists = res.data)
    },

    async reloadPlaylists() {
      await axios.get(BASE_URL + 'reloadPlaylists')
          .then(res => this.playlists = res.data)
    },

    openPlaylist(pl) {
      this.$store.state.currentPlaylist = pl
      this.$router.push({name: 'PlaylistPage'})
    }
  },

  created() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const code = urlParams.get('code')

    if (code !== null) {
      axios.post(BASE_URL + 'saveCode', {code})
          .then(() => window.location.replace('/'))
    }

    this.isAuthenticated()
  }
}
</script>

<style scoped>

</style>