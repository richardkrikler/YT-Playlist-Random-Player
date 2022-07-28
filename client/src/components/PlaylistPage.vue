<template>
  <div class="flex flex-col text-slate-200 text-center px-3">
    <h1 class="text-3xl">Playlist: {{ playlist.snippet.title }}</h1>
    <h2 class="text-xl my-2">{{ playlist.contentDetails.itemCount }} Videos</h2>
    <p>ID: {{ playlist.id }}</p>
    <p><a :href="'https://www.youtube.com/playlist?list=' + playlist.id" class="underline hover:no-underline"
          target="_blank">Link</a></p>
    <p :class="playlistLoaded ? 'bg-green-300' : 'bg-red-300'" class="text-slate-700 my-5 rounded py-1">Playlist is
      {{ playlistLoaded ? '' : 'not' }} loaded</p>

    <!--    <img :src="playlist.snippet.thumbnails.medium.url" :width="playlist.snippet.thumbnails.medium.width"-->
    <!--         alt="Playlist Thumbnail" class="m-5">-->

    <div class="flex justify-center gap-3">
      <button-element text="Home" @click="$router.push({name: 'default'})"/>
      <button-element :text="(playlistLoaded ? 'Reload' : 'Load') + ' Playlist'" @click="loadPlaylist"/>
      <button-element text="Play random video"
                      @click="$store.dispatch('playRandomVideo').then(() => $router.push({name: 'PlayerPage'}))"/>
    </div>
  </div>
</template>

<script>
import ButtonElement from './ButtonElement.vue'
import axios from 'axios'
import {BASE_URL} from '../store'

export default {
  name: 'PlaylistPage',

  components: {
    ButtonElement
  },

  data() {
    return {
      playlist: null,
      playlistLoaded: false
    }
  },

  methods: {
    async isPlaylistLoaded() {
      await axios.get(BASE_URL + 'playlistLoaded/' + this.playlist.id)
          .then(res => {
            this.playlistLoaded = res.data
          })
    },

    async loadPlaylist() {
      await axios.get(BASE_URL + 'loadPlaylist/' + this.playlist.id)
          .then(res => {
            this.playlistLoaded = res.data
          })
    }
  },

  created() {
    const playlist = this.$store.state.save.currentPlaylist
    if (playlist === null) {
      window.location.href = '/'
    } else {
      this.playlist = playlist
      this.isPlaylistLoaded()
    }
  }
}
</script>

<style scoped>

</style>