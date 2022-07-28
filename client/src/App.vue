<template>
  <div class="min-h-screen flex justify-center items-center flex-col">
    <div class="flex justify-center">

        <router-view/>

    </div>
  </div>
</template>


<script>
export default {
  name: 'App',

  created() {
    const localStorageSave = localStorage.getItem('save')
    if (localStorageSave !== null) {
      this.$store.state.save = JSON.parse(localStorageSave)
    }
  }
}
</script>

<style>
body {
  background-color: #2c3e50;
}

</style>
