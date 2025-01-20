<template>
  <div>
    <div>
      <q-select
        filled
        v-model="selectedValue"
        :options="segments"
        option-label="title"
        option-value="id"
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
  name: "JVideoSegmentSelect",
  setup() {
    const languageStore = useLanguageStore();
    return {
      languageStore,
    };
  },
  data() {
    return {
      selectedValue: {
        id: this.languageStore.getJVideoSegmentId,
        title: "SELECT",
      },
      segments: [],
      video: null,
    };
  },
  watch: {
    languageCodeHL: function (newLanguage, oldLanguage) {
      if (newLanguage !== oldLanguage) {
        this.getSegmentList(newLanguage );
      }
    },
    currentSegmentId: function (newLesson, oldLesson) {
      if (newLesson !== oldLesson) {
        this.updateSelectBar(newLesson);
      }
    },
  },
  computed: {
    currentSegmentId() {
      return this.languageStore.getJVideoSegmentId;
    },
    languageCodeHL() {
      return this.languageStore.getLanguageCodeHLSelected;
    },
    languageCodeJF() {
      return this.languageStore.getLanguageCodeJFSelected;
    },
  },
  created() {
    this.getSegmentList(this.languageCodeHL);
    this.selectedValue.id = this.currentSegmentId;
    console.log ('created with ' + this.selectedValue.id)
    this.updateLesson();
  },
  methods: {
    getSegmentList(languageCodeHL) {
      console.log (languageCodeHL + "in JVideoSegmentSelect")
      var url =
        "api/jvideo/segments/" + languageCodeHL + "/" + this.languageCodeJF;
      console.log(url);
      api.get(url).then((response) => {
        this.segments = response.data;
        console.log (this.segments)
        var languageCodeHL = 529
        console.log (languageCodeHL)
        this.languageStore.updateJVideoSegments(
          languageCodeHL,
          this.languageCodeJF,
          this.segments
        );
        console.log (languageCodeHL)
        this.updateSelectBar(this.currentSegmentId);
      });
    },
    updateLesson() {
      console.log (this.selectedValue)
      this.languageStore.updateJVideoSegmentId(this.selectedValue.id);
      this.$emit("showVideo", this.selectedValue.id);
    },
    updateSelectBar(currentSegmentId) {
      this.selectedValue = this.segments[0];
      for (var i = 0; i < this.segments.length; i++) {
        if (this.segments[i].id == currentSegmentId) {
          this.selectedValue = this.segments[i];
        }
      }
    },
  },
};
</script>
<style>
.q-item__label {
  color: black;
}
</style>
