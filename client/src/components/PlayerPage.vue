<template>
  <div class="flex flex-col gap-6">
    <div>
      <iframe id="ytplayer" type="text/html" width="640" height="360" class="max-w-full"
              :src="'https://www.youtube.com/embed/' + $store.state.save.videoId + '?autoplay=1'"
              frameborder="0"/>
    </div>

    <div class="flex justify-center gap-3">
      <button-element text="Home" @click="$router.push({name: 'default'})"/>
      <button-element text="Playlist" @click="$router.push({name: 'PlaylistPage'})"/>
    </div>
  </div>
</template>

<script>
import ButtonElement from './ButtonElement.vue'

export default {
  name: 'PlayerPage',

  components: {
    ButtonElement
  }
}
</script>

<style scoped>

</style>