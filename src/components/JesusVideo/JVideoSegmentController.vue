<template>
  <div class="q-pa-md q-gutter-md q-flex">
    <div
      v-if="this.currentSegmentId > this.minVideoId"
      class="q-gutter-md q-flex items-center inline"
    >
      <q-btn
        flat
        dense
        round
        icon="arrow_back"
        aria-label="Previous"
        @click="showPreviousSegment"
      />
      <span class="q-ml-md">{{$t("menu.previous")}}</span>
    </div>
    <q-space class="inline" />
    <div
      v-if="this.currentSegmentId < this.maxVideoId"
      class="q-gutter-md q-flex items-center inline"
    >
      <span class="q-mr-md">{{$t("menu.next")}}</span>
      <q-btn
        flat
        dense
        round
        icon="arrow_forward"
        aria-label="Next"
        @click="showNextSegment"
      />
    </div>
  </div>
</template>

<script>
import { useLanguageStore } from "stores/LanguageStore";
export default {
  name: "JVideoSegmentController",
  props: {
    videoId: Number,
  },

  data() {
    return {
      minVideoId: 1,
      maxVideoId: 61,
      nextVideoId: 0,

    };
  },
  computed: {
    currentSegmentId() {
      return Number(this.languageStore.jVideoSegmentId);
    },
    languageCodeHL() {
      return this.languageStore.getLanguageCodeHLSelected;
    },
  },
  setup() {
    const languageStore = useLanguageStore();
    return {
      languageStore,
    };
  },
  methods: {
    showNextSegment() {
      this.nextVideoId = this.currentSegmentId + 1;
      this.languageStore.updateJVideoSegmentId(this.nextVideoId);
      this.$emit("showVideo", this.nextVideoId);
    },
    showPreviousSegment() {
      this.nextVideoId = this.currentSegmentId - 1;
      this.languageStore.updateJVideoSegmentId(this.nextVideoId);
      this.$emit("showVideo", this.nextVideoId);
    },
  },
};
</script>
<style scoped>
.inline {
  display: inline-block;
}
.q-gutter-md,
.q-mr-md,
.q-ml-md {
  margin-top: 0px;
}
.q-gutter-y-md,
.q-gutter-md {
  margin-top: 0px;
}
.q-gutter-y-md > *,
.q-gutter-md > * {
  margin-top: 0px;
}
</style>
