<template>
  <h4>Select Language</h4>
  <q-option-group
    v-model="selectedLanguage"
    type="radio"
    color="primary"
    :options="languageOptions"
    @update:model-value="handleLanguageChange"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLanguageStore } from 'stores/LanguageStore';
import { languages } from '/src/data/languages.js';

const { availableLocales, locale, setLocaleMessage } = useI18n();
const languageStore = useLanguageStore();

const selectedLanguage = ref(languageStore.getLanguageValue);

const languageOptions = computed(() =>
  languages.map((item) => ({
    label: `${item.name} (${item.ethnicName})`,
    value: item.languageCodeHL,
    languageCodeJF: item.languageCodeJF,
  }))
);

const handleLanguageChange = async (languageCodeHL) => {
  const selectedOption = languageOptions.value.find(
    (option) => option.value === languageCodeHL
  );

  if (selectedOption) {
    const { languageCodeJF } = selectedOption;

    if (!availableLocales.includes(languageCodeHL)) {
      const messages = await import(`../i18n/${languageCodeHL}.json`);
      setLocaleMessage(languageCodeHL, messages.default);
    }

    locale.value = languageCodeHL;
    console.log ('language options is updating language selelctd');
    languageStore.updateLanguageSelected(languageCodeHL, languageCodeJF);
  }
};
</script>
