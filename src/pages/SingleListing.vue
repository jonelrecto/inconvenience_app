<template>
  <q-page>
    
      <div>
        <div
          style="height: 300px"
          class="row flex items-center text-white bg-primary">
          <div
            class="col-3 q-pa-md flex flex-center"
            style="">
            <span class="text-h3">
              {{ product.title }}
              <q-badge color="red">?
                <q-tooltip>
                  {{ product.description}}
                </q-tooltip>
              </q-badge>
            </span>
          </div>

          <div
            class="col q-gutter-md flex fit column wrap justify-center items-center content-center">
            <q-btn
              rounded
              class="q-pa-md"
              color="secondary"
              label="leave complaint for this business"
              size="lg" 
              @click="goToComplaint"/>
            <q-btn
              style="width: 400px"
              rounded
              class="q-pa-md"
              color="secondary"
              label="claim this business"
              size="lg" 
              to="/claimlisting"/>
          </div>

          <div
            class="col-4">
            <div
              style="width: 340px; height: 250px"
              class="flex flex column wrap justify-center items-center content-center bg-white text-italic text-weight-bolder text-black q-pa-md">
              <p
                class="text-h3">{{ product.unrecommends ? product.unrecommends.length : '0' }}</p>
              <p
                class="text-h5">Unrecommended</p>
            </div>
          </div>
        </div>

        <div class="row">
        
          <q-tab-panels
            class="col"
            v-model="tab"
            animated
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="customerReviews">
              <complaint-list id="complaintList"></complaint-list>
            </q-tab-panel>

            <q-tab-panel name="aboutTheCompany">
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
            </q-tab-panel>

            <q-tab-panel name="aboutUnrecommend">
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
            </q-tab-panel>

            <!-- <q-tab-panel name="claimThisBusiness">
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
            </q-tab-panel> -->
          </q-tab-panels>

          <q-tabs
            v-model="tab"
            vertical
            stretch
            class="text-primary col-4"
            switch-indicator
            inline-label
            no-caps
          >
            <q-tab name="customerReviews" label="Customer Reviews" />
            <q-tab name="aboutTheCompany" label="About the Company" />
            <q-tab name="aboutUnrecommend" label="About Unrecommend" />
            <!-- <q-tab name="claimThisBusiness" label="Claim this Business" /> -->
          </q-tabs>
        </div>
      </div>
      

 
  </q-page>
</template>
<script>
import ComplaintList from '../components/ComplaintList'

export default {
  components: {
    ComplaintList
  },
  created () {
    this.productId = this.$route.params.productId
  },
  mounted () {
    this.$binding('product', this.$fbFirestore.collection('products').doc(this.productId))
      .then(resp=> {
        // console.log(resp, 'resp')
      })
  },
  data () {
    return {
      tab: 'customerReviews',
      splitterModel: 20,
      productId: '',
      product: {}
    }
  },
  computed: {
    user () {
      console.log(this.$store.getters['BackendModule/getUser'], 'user')
      return this.$store.getters['BackendModule/getUser']
    }
  },
  methods: {
    goToComplaint () {
      if (this.user) {
        var elmnt = document.getElementById('complaintList')
        elmnt.scrollIntoView(false)
        // window.scrollTo(0,document.body.scrollHeight);
      } else {
        this.$router.push('/signin')
      }
      
    }
  }
  
}
</script>

