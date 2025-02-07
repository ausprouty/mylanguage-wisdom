<template>
  <q-page padding>
    <h2>{{ $t("life.title") }}</h2>
    <p>{{ $t("life.para1") }}</p>
    <p>{{ $t("life.para2") }}</p>
    <div>
      <JVideoSegmentSelect
        :languageCodeHL="computedLanguageCodeHLSelected"
        @showVideo="handleNewVideoSegment"
      />
    </div>
    <div>
      <JVideoSegmentController
        :videoSegment="computedVideoSegmentId"
        :languageCodeHL="computedLanguageCodeHLSelected"
        @showVideo="handleNewVideoSegment"
      />
    </div>
    <div>
      <JVideoPlayer :languageCodeHL="computedLanguageCodeHLSelected" />
    </div>

    <div>
      <JVideoQuestions :languageCodeHL="computedLanguageCodeHLSelected" />
    </div>
    <!-- content -->
  </q-page>
</template>

<script>
import JVideoPlayer from "src/components/JVideo/JVideoPlayer.vue";
import JVideoSegmentSelect from "src/components/JVideo/JVideoSegmentSelect.vue";
import JVideoSegmentController from "src/components/JVideo/JVideoSegmentController.vue";
import JVideoQuestions from "src/components/JVideo/JVideoQuestions.vue";
import { useLanguageStore } from "stores/LanguageStore";
import { computed } from "vue";

export default {
  name: "JesusVideoMaster",
  props: {
    lesson: Number,
    languageCodeHL: String,
  },
  components: {
    JVideoPlayer,
    JVideoSegmentSelect,
    JVideoSegmentController,
    JVideoQuestions,
  },
  data() {
    return {
      languageSelected: this.languageStore.getLanguageSelected,
    };
  },
  setup() {
    const languageStore = useLanguageStore();
    return {
      languageStore,
    };
  },
  created() {
    if (this.$route.params.lessonLink !== "") {
      this.languageStore.updateJVideoSegmentId(this.$route.params.lessonLink);
    }
    if (this.$route.params.languageCode !== "") {
      this.languageStore.updateLanguageCodeHLSelected(
        this.$route.params.languageCode
      );
    }
  },
  computed: {
    computedLanguageCodeHLSelected() {
      return this.languageStore.getLanguageCodeHLSelected;
    },
    computedVideoSegmentId() {
      return this.languageStore.getJVideoSegmentId;
    },
  },
  watch: {
    computedVideoSegmantId: function (newValue, oldValue) {
      if (newValue !== oldValue) {
        return newValue;
      }
    },
    computedLanguageSelected: function (newLanguage, oldLanguage) {
      if (newLanguage !== oldLanguage) {
        return newLanguage;
      }
    },
  },

  methods: {
    handleNewVideoSegment(response) {
      console.log("handleNewVideoSegment");
      console.log(response);
      this.videoSegment = response;
      this.languageStore.updateJVideoSegmentId(response);
    },
  },
};
</script>
<style>
.q-page {
  background-color: white;
}
</style>
