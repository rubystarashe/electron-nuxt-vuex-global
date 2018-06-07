<template>
<div>
  Second Page!
  {{$store.state.messages}}
  <button @click="RECEIVE_MESSAGE('second')">second</button>
</div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations({
      RECEIVE_MESSAGE: 'RECEIVE_MESSAGE'
    })
  }
}
</script>

<style>
body {
  font-size: 5vh;
}
</style>