<template>
  <div class="arc-cont" v-html="videoIframe"></div>
</template>

<script>
import { ref, computed, watch, toRefs } from "vue";

export default {
  name: "JVideoPlayer",
  props: {
    videoUrls: Object, // Object containing video URLs by lesson number
    lesson: Number, // Computed lesson number
  },
  setup(props) {
    const { videoUrls, lesson } = toRefs(props); // Ensure reactivity

    const videoIframe = ref(null);
    const iframeStart = '<iframe id="jplayer" ';
    const iframeEnd =
      " allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>";

    // Compute the video URL based on lesson number
    // videoUrls looks like: {index: 6, url: 'https://api.arclight.org/videoPlayerUrl?refId=1_529-jf6106-0-0&playerStyle=default'}
    const videoUrl = computed(() => {
      if (!videoUrls.value) return "https://api.arclight.org/videoPlayerUrl?refId=1_529-jf6102-0-0&playerStyle=default";

      const foundVideo = videoUrls.value.find(v => v.index === index.value);

      return foundVideo ? foundVideo.url : "https://api.arclight.org/videoPlayerUrl?refId=1_529-jf6102-0-0&playerStyle=default";
    });


    // Update the iframe content when lesson or video URL changes
    const updateVideoIframe = () => {
      if (videoUrl.value) {
        videoIframe.value = `${iframeStart}src="${videoUrl.value}"${iframeEnd}`;
      } else {
        videoIframe.value = null; // Clear if no video found
      }
    };

    // Watch for changes in lesson number and update the iframe
    watch(() => props.lesson, updateVideoIframe, { immediate: true });

    return {
      videoIframe,
    };
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
