<template>
  <div class="min-h-screen flex justify-center items-center flex-col">
    <div class="flex justify-center">

        <router-view/>

    </div>
  </div>
</template>


<script>
export default {
  name: 'App'
}
</script>

<style>
body {
  background-color: #2c3e50;
}

</style>
