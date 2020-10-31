<template>
  <q-page>
    <div class="bg-primary text-white q-pa-md" style="height: 50%;">
      <div class="row flex flex-center">
        <div class="col text-left">
          <p class="text-h3">World first! A website solely for complaints, negative reviews and criticisms</p>
          <br/>
          <div class="text-body1 text-weight-medium">

            <p>Our mission is to help surface bad experiences &amp; help companies learn from their mistakes.</p>


            <p>
We offer a free platform for consumers to complain about bad experiences. By doing so, we help business owners and managers move forward improve their precesses, products and services and address what went wrong.</p>
          </div>
        </div>

         <div class="col text-center">
          <img src="../assets/about-img.png">
        </div>
      </div>

    </div>

    <div class="q-pa-md" style="height: 50%">
      <div class="row flex flex-center">

        <div class="col text-center">
          <img src="../assets/about-1.png">
        </div>

        <div class="col text-left">
          <p class="text-h4">How are we different?</p>
          <br/>
          <div class="text-body1 text-weight-medium">

            <p>Trust Pilot, Google Reviews, Bazaarvoice, PowerReviews and others offer the ability for consumers to post positive and negative reviews. The average score is 4.2 stars out of 5. What this means is there are many more positive reviews than negative.</p>
            <p>We want to create a platform that concentrates on bad experiences, complaints, defective products, rip-offs and bad service. That way issues cant be buried and the truth laid bare for all to use.</p>
          </div>
        </div>

      </div>
    </div>



    <div class="row flex flex-center q-pa-md">
      <div class="col text-left">
        <div class="text-body1 text-weight-medium">

          <p class="text-h4">Why Inconvenient: Bad Reviews is great for Businesses</p>


          <p>
            While it sucks that you have negative reviews, our website allows you to respond, take stocks of what's going wronf and forge ahead. With powerful tools, both analytical and SEO, you can take stock of your online reputation and use our service to focus on the negative and making your business great again.
          </p>
        </div>
      </div>

       <div class="col text-center">
        <img src="../assets/about-img.png">
      </div>
    </div>

    <complaint-banner></complaint-banner>

  </q-page>
</template>
<script>
import ComplaintBanner from '../components/ComplaintBanner'

export default {
  components: {
    ComplaintBanner
  }
}
</script>
