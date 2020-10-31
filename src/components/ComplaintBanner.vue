<template>
  <div class="text-white" v-bind:style="{ 'height': '250px', 'background-image': 'url(' + image + ')' }">
    <div class="text-center" style="padding-top: 40px">
      <span class="text-h4">ANGRY?</span> <br />
      <p class="text-h3">LEAVE COMPLAINT NOW!</p> <br />

      <q-btn size="lg" color="secondary" label="Leave complaint" @click="toRequestQuote"/>
    </div>
    
  </div>
</template>
<script>
var image = require('../assets/complaint-banner.jpg')
export default {
  data () {
    return {
      image: image
    }
  },
  computed: {
    user () {
      return this.$store.getters['BackendModule/getUser']
    }
  },
  methods: {
    toRequestQuote () {
      if (this.user) {
        this.$router.push('/requestquote')
      } else {
        this.$router.push('/signin')
      }
    }
  }
}
</script>
