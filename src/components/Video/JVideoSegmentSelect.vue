<template>
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
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useLanguageStore } from 'stores/LanguageStore';
import { legacyApi } from 'boot/axios';

const props = defineProps({
  videoId: Number,
});

const selectedValue = ref({
  id: null,
  title: 'SELECT',
});
const segments = ref([]);
const video = ref(null);

const languageStore = useLanguageStore();

const currentSegmentId = computed(() => languageStore.getJVideoSegmentId);
const languageCodeHL = computed(() => languageStore.getLanguageCodeHLSelected);
const languageCodeJF = computed(() => languageStore.getLanguageCodeJFSelected);

watch(languageCodeHL, (newLanguage, oldLanguage) => {
  if (newLanguage !== oldLanguage) {
    getSegmentList(newLanguage);
  }
});

watch(currentSegmentId, (newLesson, oldLesson) => {
  if (newLesson !== oldLesson) {
    updateSelectBar(newLesson);
  }
});

const getSegmentList = async (languageCodeHL) => {
  console.log(`${languageCodeHL} in JVideoSegmentSelect`);
  const url = `api/jvideo/segments/${languageCodeHL}/${languageCodeJF.value}`;
  console.log(url);
  try {
    const response = await legacyApi.get(url);
    segments.value = response.data;
    console.log(segments.value);
    languageStore.updateJVideoSegments(
      languageCodeHL,
      languageCodeJF.value,
      segments.value
    );
    updateSelectBar(currentSegmentId.value);
  } catch (error) {
    console.error('Error fetching segment list:', error);
  }
};

const updateLesson = () => {
  console.log(selectedValue.value);
  languageStore.updateJVideoSegmentId(selectedValue.value.id);
  emit('showVideo', selectedValue.value.id);
};

const updateSelectBar = (currentSegmentId) => {
  selectedValue.value = segments.value.find(
    (segment) => segment.id === currentSegmentId
  ) || { id: null, title: 'SELECT' };
};

onMounted(() => {
  getSegmentList(languageCodeHL.value);
  selectedValue.value.id = currentSegmentId.value;
  console.log(`created with ${selectedValue.value.id}`);
  updateLesson();
});
</script>

<style>
.q-item__label {
  color: black;
}
</style>
