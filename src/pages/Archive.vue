<template>
  <q-page padding>
    <h4>{{products.length > 0 ? products[0].category.label : 'Empty products'}}</h4>
    <div class="row">
      <div class="col">
        <div class="flex flex-center q-gutter-md">
          <q-card v-for="product in products" :key="product['.key']" class="my-card" flat style="cursor: pointer" >
            <q-img ratio="2" :src="product.productImageUrl" @click="$router.push(`/singlelisting/${product['.key']}`)"/>

            <q-card-section>
              <div class="text-h6">{{ product.title}}</div>
            </q-card-section>

            <q-card-section>
              {{ product.description }}
              <p v-if="product.description.length > 200"><q-btn dense flat label="Read More" /></p>
              
            </q-card-section>

            <q-separator/>

            <q-card-actions align="around">
              <q-btn size="12px" no-caps :flat="isUserUnrecommend(product)" color="primary" icon="sentiment_very_dissatisfied" label="Unrecommend" @click="unrecommend(product)">
                <q-badge v-if="product.unrecommends && product.unrecommends.length > 0" color="red" floating>{{product.unrecommends ? product.unrecommends.length : ''}}</q-badge>
              </q-btn>
              <q-btn size="12px" no-caps flat color="primary" icon="chat_bubble" label="Complaints" :to="`/singlelisting/${product['.key']}`">
                <!-- <q-badge color="red" floating>{{noOfProductComplaints(product['.key'])}}</q-badge> -->
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>
        <div class="text-center">
          <!-- <q-btn color="secondary" label="Load more" /> -->
        </div>
       
      </div>

       
    
      <div class="col-3">
        <h5>Filter</h5>
        <q-list style="min-width: 100px">
          <q-item v-for="cat in categories" :key="cat['.key']" clickable :to="`/archive/${cat['.key']}`">
            <q-item-section>{{cat.categoryName}}</q-item-section>
          </q-item>
          <!-- <q-item clickable v-close-popup>
            <q-item-section>Services</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>Travel</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>Products</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>Shops</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>Appliances</q-item-section>
          </q-item> -->
        </q-list>
      </div>
    </div>
    
  </q-page>
</template>
<script>
export default {
  created () {
    this.categoryId = this.$route.params.categoryId
  },
  async mounted () {
    // await this.$binding('comments', this.$fbFirestore.collection('products').doc(this.productId).collection('comments'))  
    await this.$binding('products', this.$fbFirestore.collection('products').where('category.value', '==', this.categoryId))
    await this.$binding('categories', this.$fbFirestore.collection('categories'))
  },
  data () {
    return {
      categories: [],
      paginateValue: 10,
      products: [],
      categoryId: '',
      lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      insurances: [
        { productName: 'AXA Philippines', imageLink: '../statics/categories/insurance.jpg'},
        { productName: 'Sun Life', imageLink:'../statics/categories/insurance.jpg' },
        { productName: 'BPI-Philam Life Assurance Corp., Inc.', imageLink: '../statics/categories/insurance.jpg' },
        { productName: 'Philippine American Life & General lnsurance Co.', imageLink: '../statics/categories/insurance.jpg' },
        { productName: 'Pru Life lnsurance Corporation of U.K.', imageLink: '../statics/categories/insurance.jpg' },
        { productName: 'United Coconut Planters Life Assurance Corporation (COCOLIFE)', imageLink:  '../statics/categories/insurance.jpg'}
      ]
    }
  },
  watch: {
    ['$route.params.categoryId']: {
      async handler () {
        this.categoryId = this.$route.params.categoryId
        await this.$binding('products', this.$fbFirestore.collection('products').where('category.value', '==', this.categoryId))
      },
      deep: true
    }
  },
  computed: {
    user () {
      return this.$store.getters['BackendModule/getUser']
    },
  },
  methods: {
    noOfProductComplaints (productId) {
      // console.log(productId, 'prodid')
      this.$fbFirestore.collection('products').doc(productId).collection('comments').get()
        .then(data => {
          console.log(data.size, 'data return ')
          return data.size
        }).catch(err => {
          return 0
        })
    },
    isUserUnrecommend (product) {
      if (product.unrecommends) {
        if (this.user) {
          let isAlreadyIndex = product.unrecommends.findIndex(user => {
            return user === this.user.uid
          })
          if (isAlreadyIndex > -1) {
            return false
          } else {
            return true
          }
        } else {
          return true
        }
        
      } else {
        return true
      }
    },
    unrecommend (product) {
      if (this.user) {
        let key = product['.key']
        if (product.unrecommends) {

          // check if already unrecommend 
          let isAlreadyIndex = product.unrecommends.findIndex(user => {
            return user === this.user.uid
          })
          // if already remove from the list of unrecommends
          if (isAlreadyIndex > -1) {
            product.unrecommends.splice(isAlreadyIndex, 1)
            this.updateProductUnrecommend (key, product.unrecommends)
          } else {
            // else add to the list
            product.unrecommends.push(this.user.uid)
            this.updateProductUnrecommend (key, product.unrecommends)
          }
        
        } else {
          product.unrecommends = []
          product.unrecommends.push(this.user.uid)
  
          this.updateProductUnrecommend (key, product.unrecommends)
        }

      } else {
        console.log('di naka login')
        this.$router.push('/signin')
      }
    },
    updateProductUnrecommend (key, unrecommends) {
      this.$fbFirestore.collection('products').doc(key).update({
          unrecommends: unrecommends
        }).catch(err => {
          console.log(err)
          this.$q.notify({
            message: 'an error occur',
            icon: 'error',
            color: 'negative'
          })
        })
    }
  }
}
</script>
<style lang="stylus">
.my-card {
  width: 100%
  max-width: 300px
}
  
</style>