<template>
  <div class="arc-cont" v-html="this.videoIframe"></div>
</template>

<script>
import { api } from "boot/axios";
import { useLanguageStore } from "stores/LanguageStore";

export default {
  name: "JVideoPlayer",

  data() {
    return {
      show1: false,
      iframeStart: '<iframe id="guruplayer" ',
      iframeEnd:
        " allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>",
      videoIframe: null,
    };
  },
  setup() {
    const languageStore = useLanguageStore();
    return {
      languageStore,
    };
  },
  created(){
    this.updateVideoShown()
  },
  watch: {
    languageCodeHL: function (newLanguage, oldLanguage) {
      if (newLanguage !== oldLanguage) {
        this.updateVideoShown();
      }
    },
    videoSegmentId: function (newVideoSegment, oldVideoSegment) {
      if (newVideoSegment !== oldVideoSegment) {
        this.updateVideoShown();
      }
    },
  },
  computed: {
    languageCodeHL() {
      return this.languageStore.getLanguageCodeHLSelected;
    },
    languageCodeJF() {
      return this.languageStore.getLanguageCodeJFSelected;
    },
    videoSegmentId() {
      return this.languageStore.getJVideoSegmentId;
    },
  },
  methods: {
    updateVideoShown(){
      var segments = this.languageStore.getJVideoSegments;
     // console.log ('this is segments')
    //  console.log (segments)
      if (segments == null || typeof segments == 'undefined'){
       // console.log ('I am getting new JV segments because there are not any')
        this.getNewJVideoSegments();
      }
      if (segments.languageCodeHL != this.languageStore.getLanguageCodeHLSelected){
       // console.log ('I am getting new JV segments because language changed')
        this.getNewJVideoSegments();
      }
      else{
       // console.log ('I am NOT getting new JV segments because we have them')
        this.updateVideoIframe();
      }
    },
    getNewJVideoSegments(){
      var url =
        "api/jvideo/segments/" + this.languageCodeHL + "/" + this.languageCodeJF
      console.log(url);
      api.get(url).then((response) => {
        this.segments = response.data;
        console.log (this.segments)
        console.log (this.languageCodeHL+ '  ' + this.languageCodeJF)
        this.languageStore.updateJVideoSegments(
          this.languageCodeHL,
          this.languageCodeJF,
          this.segments
        );
        this.updateVideoIframe();
      });
    },
    updateVideoIframe() {

      var videoSegmentId = this.videoSegmentId
      if ( videoSegmentId == null || typeof videoSegmentId == 'undefined'){
        videoSegmentId  = 1
      }
      console.log ('videosegmentid ' + videoSegmentId);
      var videoSource = 'src="https://api.arclight.org/videoPlayerUrl?refId=1_529-jf6101-0-0&start=0&end=&playerStyle=default"'
      var segments = this.languageStore.getJVideoSegments;
      //console.log (segments.segments);
      for (var i = 0; i < segments.segments.length; i++) {
        if (segments.segments[i].id == videoSegmentId) {
          videoSource = segments.segments[i].src;
          console.log (videoSource)
          break;
        }
      }
      this.videoIframe = this.iframeStart + videoSource + this.iframeEnd;
      //console.log(this.videoIframe);
    },
  },
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
