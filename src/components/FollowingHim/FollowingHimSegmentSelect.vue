<template>
  <div>
    <div>
      <q-select
        filled
        v-model="selectedValue"
        :options="segments"
        option-label="title"
        option-value="videoSegment"
        @update:model-value="updateLesson"
        label="Video Segment"
        class="select"
      />
  </div>
</div>
</template>

<script>
import { api } from "boot/axios";
import { useLanguageStore } from "stores/LanguageStore";
export default {
  name: "FollowingHimSegmentSelect",
  props: {
    languageCodeHL: String,
  },
  setup() {
    const languageStore = useLanguageStore();
    return {
      languageStore,
    };
  },
  data() {
    return {
      selectedValue : {
        videoSegment: '1-0-0',
        title: 'SELECT'
      },
      video: null,
      segments: [
        {
          videoSegment: '1-0-0',
          title: '1. Who Is God?',
        },
        {
          videoSegment: '2-0-0',
          title: '2. Who Is Jesus?',
        },
        {
          videoSegment: '3-0-0',
          title: '3. Prayer - Talking to God',
        },
        {
          videoSegment: '4-0-0',
          title: '4. Living as a Disciple of Jesus',
        },
        {
          videoSegment: '5-0-0',
          title: '5. Sharing Your Faith With Others',
        },
      ],
    }
  },
  created() {
    console.log (this.selectedValue)
    this.selectedValue.videoSegment = this.currentSegment ;
    this.updateLesson();
  },
  watch: {
    languageCodeHL: function (newLanguage, oldLanguage) {
      if (newLanguage !== oldLanguage) {
        this.getSegmentList(newLanguage);
      }
    },
    currentSegment: function (newLesson, oldLesson) {
      if (newLesson !== oldLesson) {
        this.updateSelectBar(newLesson);

      }
    }
  },
  computed: {
    currentSegment() {
      return this.languageStore.getFollowingHimSegment;
    },
  },
  created() {
    this.selectedValue.videoSegment = this.currentSegment
    this.updateLesson();

  },
  methods:{
    updateLesson() {
      console.log (this.selectedValue.videoSegment)
      this.updateSelectBar(this.selectedValue.videoSegment)
      this.languageStore.updateFollowingHimSegment(this.selectedValue.videoSegment);
      this.$emit('showVideo',this.selectedValue.videoSegment)
    },
    getSegmentList(){ // all is English now
      return;
    },
    updateSelectBar(currentSegment){
      console.log (currentSegment)
      this.selectedValue = this.segments[0]
      console.log (this.selectedValue)
      for (var i = 0; i< this.segments.length; i++){
        if (this.segments[i].videoSegment == currentSegment){
          this.selectedValue = this.segments[i];
        }
      }
      console.log (this.selectedValue)
    },
  }
};
</script>
<style>

.q-item__label{
  color:black;
}
</style>
