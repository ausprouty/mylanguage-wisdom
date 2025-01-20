<template>
  <div class="arc-cont" v-html="this.videoIframe"></div>
</template>

<script>
import { api } from "boot/axios";
import { useLanguageStore } from "stores/LanguageStore";

export default {
  name: "FollowinggHimPlayer",
  props: {
    languageCodeHL: String,
  },
  data() {
    return {
      iframeStart:
        '<iframe  id="guruplayer" src="https://api.arclight.org/videoPlayerUrl?refId=',
      iframeEnd:
        '&playerStyle=default" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>',
      videoIframe: null,
    };
  },
  setup() {
    const languageStore = useLanguageStore();
    return {
      languageStore,
    };
  },

  created() {
    this.updateVideoIframe(this.languageCodeHL, this.videoSegment)
  },
  watch: {
    languageCodeHL: function (newLanguage, oldLanguage) {
      if (newLanguage !== oldLanguage) {
        this.updateVideoIframe(newLanguage, this.videoSegment);
      }
    },
    videoSegment: function (newVideoSegment, oldVideoSegment) {
      if (newVideoSegment !== oldVideoSegment) {
        this.updateVideoIframe(this.languageCodeHL, newVideoSegment);
      }
    },
  },
  computed: {
    videoSegment() {
      return this.languageStore.getFollowingHimSegment;
    },
  },
  methods: {
    updateVideoIframe(languageCodeHL, videoSegment) {
      var videoLanguage = this.languageStore.getLanguageCodeJFSelected;
      if (videoSegment == null || typeof videoSegment == 'undefined'){
        videoSegment = "1-0-0"
      }
      var video1 = '1_' + videoLanguage + '-fj_' + videoSegment;
      console.log (video1)
      this.videoIframe = this.iframeStart + video1 + this.iframeEnd;
    }
  }
};
</script>
<style>
.arc-cont {
  position: relative;
  display: block;
  margin: 10px auto;
  width: 100%;
}
.arc-cont:after {
  padding-top: 59%;
  display: block;
  content: "";
}
.arc-cont > iframe {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 98%;
  height: 98%;
  border: 0;
}
</style>
