<template>
  <div class="flex flex-col gap-6">
    <div>
      <YoutubeVue3 :videoid="$store.state.save.videoId" :width="640" :height="360" :controls="1"
                   @ended="videoEnded" class="max-w-full"></YoutubeVue3>
    </div>

    <div class="flex flex-wrap justify-center gap-3">
      <button-element text="Home" @click="$router.push({name: 'default'})"/>
      <button-element text="Playlist" @click="$router.push({name: 'PlaylistPage'})"/>
      <button-element text="Next Video"
                      @click="$store.dispatch('playRandomVideo')"/>
      <div class="bg-blue-400 text-white px-5 py-2 rounded flex gap-3">
        <label for="autoplay">Autoplay</label>
        <input type="checkbox" name="autoplay" class="w-4 h-4 my-auto"
               :checked="$store.state.save.autoplay" v-model="$store.state.save.autoplay"
               @change="$store.dispatch('save')">
      </div>
    </div>
  </div>
</template>

<script>
import ButtonElement from './ButtonElement.vue'
import {YoutubeVue3} from 'youtube-vue3'

export default {
  name: 'PlayerPage',

  components: {
    ButtonElement,
    YoutubeVue3
  },

  methods: {
    videoEnded() {
      if (this.$store.state.save.autoplay) {
        this.$store.dispatch('playRandomVideo')
      }
    }
  },

  created() {
    const videoId = this.$store.state.save.videoId
    if (videoId === null) {
      window.location.href = '/'
    }
  }
}
</script>

<style scoped>

</style>