<template>
  <div class="q-pa-md ">
    <div v-if="!comments" class="text-h6">
      <span>No complaint yet</span>
    </div>
    <div v-else class="flex flex-center q-pb-md">
      <q-card v-for="(comment, i) in comments" :key="comment['.key']" flat bordered class="my-card bg-grey-1 q-ma-md">
        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              
              <p class="text-h6">
                <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar.png">
              </q-avatar>
                {{comment.name}}</p>
            </div>
            <span class="text-caption">{{ $moment(comment.dateCreated.toDate()).format('MMM D, YYYY') }}</span>

            <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert">
                <q-menu cover auto-close>
                  <q-list>
                    <q-item clickable>
                      <q-item-section>Report</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section>Send Feedback</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section>Share</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div>
            <span class="text-subtitle2">{{ comment.title }}</span>
            <br />
            {{ comment.complaint }}
            <q-btn v-if="comment.complaint && comment.complaint.length > 200" flat color="primary" label="Read more"  size="sm"/>
          </div>

          <div class="q-gutter-md">
             <q-img v-for="(image, i) in comment.complaintImageUrl"
             :key="i"
              :src="image"
              spinner-color="red"
              style="height: 140px; max-width: 150px"
            />
            
          </div>

        </q-card-section>

        <q-separator />

        <q-card-actions>
          <div class="row flex items-center self-center" style="width: 100%">
            <div v-if="user && user.userData.type == 'normal'" class="col">
              <q-btn no-caps flat icon="mdi-thumb-up-outline" class="full-width" @click="likeComment(comment)">
                Like
                <q-badge v-if="comment.likes && comment.likes.length > 0" color="red" floating>
                  {{comment && comment.likes ? comment.likes.length : ''}}
                </q-badge>
              </q-btn>
            </div>
            <div v-if="user && user.userData.type === 'owner'" class="col">
              <q-btn @click="replyComment(i)" class="full-width" flat  no-caps>Reply</q-btn>
            </div>
            
            
          </div>
            
        </q-card-actions>

  
        <q-separator />

        <div v-if="user && user.userData.type === 'owner'">
          <q-card-section v-if="isReply[i] && isReply[i].isEnable">
            <div>
              <q-input v-model="isReply[i].reply" type="textarea" label="Write a reply" row="4" />
              <q-btn size="sm" color="secondary" icon="send" label="send" @click="sendReply(comment, i)" />
            </div>
          </q-card-section>

        <q-card-section v-if="comment.replies">
          <div class="fit row wrap justify-center items-center content-center q-ml-md">
            <q-card v-for="(reply, ind) in comment.replies" :key="ind" bordered class="reply-card">

              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    
                    <p class="text-subtitle2">
                      <q-avatar> <img src="https://cdn.quasar.dev/img/avatar.png"> </q-avatar>
                      {{ reply.userData.userName }} ( {{ reply.userData.type }} )
                    
                    </p>
                  </div>
                  <span class="text-caption">{{ $moment(reply.dateCreated.toDate()).format('MMM D, YYYY') }}</span>
                </div>
                <div class="text-body2">
                  {{ reply.reply }}
                  <q-btn v-if="comment.replies && reply.reply.length > 200" flat color="primary" label="Read more"  size="sm"/>
                </div>
                
              </q-card-section>


            </q-card>
          </div>
            
          </q-card-section>

        </div>

        
        
        
      </q-card>

      <!-- <q-pagination
        v-model="current"
        :max="5"
        :direction-links="true"
      >
      </q-pagination> -->
    </div>
    <div v-if="user">
      <leave-complaint></leave-complaint>
    </div>
    
  </div>
</template>
<script>
import LeaveComplaint from '../components/LeaveComplaint'

const moment = require('moment')

export default {
  components: {
    LeaveComplaint
  },
  created () {
    this.productId = this.$route.params.productId
  },
  mounted () {
    this.$binding('comments', this.$fbFirestore.collection('products').doc(this.productId).collection('comments'))  
      .then(data => {
        console.log(data, 'data')
        if (data) {
          for (var i = 0; i < data.length; i++) {
            let config =  {
              isEnable: false,
              reply: ''
            }
            this.isReply.push(config)
          }
        }
      })
  },
  data () {
    return {
      productId: '',
      current: 1,
      lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      comments: [],
      isReply: [],
      toComment: {}
    }
  },
  computed: {
    user () {
      // console.log(this.$store.getters['BackendModule/getUser'], 'getuser')
      return this.$store.getters['BackendModule/getUser']
    }
  },
  methods: {
    sendReply (comment, index) {
      console.log(comment, this.isReply[index], 'reply')
      if (this.user) {
        let userReply = {
          ...this.user,
          reply: this.isReply[index].reply,
          dateCreated: new Date()
        }
        if (comment.replies) {
          comment.replies.push(userReply)
          console.log(comment.replies, 'replies')
          this.updateCommentReply(comment['.key'], comment.replies)
            .then(() => {
              this.isReply[index].isEnable = false
              this.isReply[index].reply = ''
            }).catch(err => {
              console.log(err)
            })
        } else {
          comment.replies = [] 
          comment.replies.push(userReply)
          this.updateCommentReply(comment['.key'], comment.replies)
            .then(() => {
              this.isReply[index].isEnable = false
              this.isReply[index].reply = ''
            }).catch(err => {
              console.log(err)
            })
        }
      } else {
        this.$router.push('/signin')
      }
      
    },
    replyComment (index) {
      this.isReply[index].isEnable = !this.isReply[index].isEnable
      this.$forceUpdate()
    },
    likeComment (comment) {
      if (this.user) {
        let key = comment['.key']
        if (comment.likes) {

          // check if already unrecommend 
          let isAlreadyIndex = comment.likes.findIndex(user => {
            return user === this.user.uid
          })
          // if already remove from the list of unrecommends
          if (isAlreadyIndex > -1) {
            comment.likes.splice(isAlreadyIndex, 1)
            this.updateCommentLikes (key, comment.likes)
          } else {
            // else add to the list
            comment.likes.push(this.user.uid)
            this.updateCommentLikes (key, comment.likes)
          }
        
        } else {
          comment.likes = []
          comment.likes.push(this.user.uid)
  
          this.updateCommentLikes(key, comment.likes)
        }

      } else {
        this.$router.push('/signin')
      }
    },
    updateCommentLikes (key, likes) {
      this.$fbFirestore.collection('products').doc(this.productId).collection('comments').doc(key).update({
        likes: likes
      }).then(() => {
      }).catch(err => {
        console.log(err)
        this.$q.notify({
          message: 'an error occur',
          icon: 'error',
          color: 'negative'
        })
      })
    },
    updateCommentReply (key, reply) {
      return new Promise((resolve, reject) => {
        this.$fbFirestore.collection('products').doc(this.productId).collection('comments').doc(key).update({
          replies: reply
        }).then(() => {
          resolve()
        }).catch(err => {
          console.log(err)
          this.$q.notify({
            message: 'an error occur',
            icon: 'error',
            color: 'negative'
          })
          reject(err)
        })
      })
    }
  }
}
</script>
<style lang="stylus">
.my-card {
  width: 100%
  max-width: 700px
}

.reply-card {
  width: 100%
  max-width: 600px
  height: 100%
}
  
</style>
