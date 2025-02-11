<template>
  <div class="q-pa-md q-gutter-md q-flex">
    <div
      v-if="currentSegmentId > minVideoId"
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
      <span class="q-ml-md">{{ t('menu.previous') }}</span>
    </div>
    <q-space class="inline" />
    <div
      v-if="currentSegmentId < maxVideoId"
      class="q-gutter-md q-flex items-center inline"
    >
      <span class="q-mr-md">{{ t('menu.next') }}</span>
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

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLanguageStore } from 'stores/LanguageStore';

const props = defineProps({
  videoId: Number,
});

const minVideoId = ref(1);
const maxVideoId = ref(61);
const nextVideoId = ref(0);

const languageStore = useLanguageStore();
const { t } = useI18n();

const currentSegmentId = computed(() => Number(languageStore.jVideoSegmentId));
const languageCodeHL = computed(() => languageStore.getLanguageCodeHLSelected);

const showNextSegment = () => {
  nextVideoId.value = currentSegmentId.value + 1;
  languageStore.updateJVideoSegmentId(nextVideoId.value);
  emit('showVideo', nextVideoId.value);
};

const showPreviousSegment = () => {
  nextVideoId.value = currentSegmentId.value - 1;
  languageStore.updateJVideoSegmentId(nextVideoId.value);
  emit('showVideo', nextVideoId.value);
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
