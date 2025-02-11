<template>
  <div v-html="questions"></div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { legacyApi } from 'boot/axios';
import { useLanguageStore } from 'stores/LanguageStore';

const questions = ref('');

const languageStore = useLanguageStore();

const languageCodeHL = computed(() => languageStore.getLanguageCodeHLSelected);

const showQuestions = async (languageCodeHL) => {
  const url = `api/jvideo/questions/${languageCodeHL}`;
  console.log(url);
  try {
    const response = await legacyApi.get(url);
    console.log(response);
    questions.value = response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
};

watch(languageCodeHL, (newLanguage, oldLanguage) => {
  if (newLanguage !== oldLanguage) {
    showQuestions(newLanguage);
  }
});

onMounted(() => {
  showQuestions(languageCodeHL.value);
});
</script>
