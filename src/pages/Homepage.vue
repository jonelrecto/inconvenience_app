<template>
  <q-page style="border: 0px black solid">
    
    <div class="q-px-md text-center bg-primary text-white" style="height: 200px; border: 1px solid black">
      <h3>Categories</h3>
    </div>


    <div class="flex flex-center q-px-md bg-white" >
      <q-card flat v-for="(cat, i) in categories" :key="i" class="my-card q-pa-md" style="cursor: pointer" @click="$router.push(`/archive/${cat['.key']}`)">
        <q-img
        sizes="300px"
          :src="cat.imageUrl"
          basic
          :ratio="1"

        >
          <div class="absolute-bottom text-subtitle2 text-center">
            {{ cat.categoryName }}
          </div>
        </q-img>
      </q-card>
    </div>
    
    <complaint-banner></complaint-banner>
  </q-page>
</template>
<script>
import ComplaintBanner from '../components/ComplaintBanner'

export default {
  name: 'homepage',
  components: {
    ComplaintBanner
  },
  mounted () {
    this.$binding('categories', this.$fbFirestore.collection('categories'))
  },
  data () {
    return {
      categories: []
      // categories: [
      //   { title: 'Insurance', imageLink: '../statics/categories/insurance.jpg'},
      //   { title: 'Services', imageLink: '../statics/categories/services.jpg'},
      //   { title: 'Travel', imageLink: '../statics/categories/travel.jpg'},
      //   { title: 'Products', imageLink: '../statics/categories/products.jpg'},
      //   { title: 'Shops', imageLink: '../statics/categories/shops.png'},
      //   { title: 'Appliances', imageLink: '../statics/categories/appliances.png'}
      // ]
    }
  }
}
</script>
<style lang="stylus">
.my-card {
  width: 300px;
  max-width 100%;
}
  
</style>