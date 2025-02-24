<template>
  <div>
    <SharedContentSection
      :content="commonContent"
      sectionKey="video"
      placeholder="Write your notes for this video here"
    />
  </div>
</template>

<script>
import SharedContentSection from "src/components/SharedContentSection.vue";

export default {
  name: "VideoPlayerContent",
  components: { SharedContentSection },
  props: {
    commonContent: { type: Object, required: true },
  },
};
</script>
