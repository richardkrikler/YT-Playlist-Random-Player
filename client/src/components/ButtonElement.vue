<template>
  <button class="bg-blue-400 hover:bg-blue-600 text-white px-5 py-2 rounded active:bg-blue-500">{{ text }}</button>
</template>

<script>
export default {
  name: 'ButtonElement',

  props: {
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>