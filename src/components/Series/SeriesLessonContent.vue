<template>
  <div v-if="lessonContent">
    <h1 class="title dbs">{{ lessonContent.title }}</h1>

    <section v-if="commonContent">
      <h2 class="ltr dbs">{{ commonContent.look_back.title }}</h2>
      <ol class="ltr dbs">
        <li v-for="(item, index) in commonContent.look_back.question" :key="'back-' + index">
          {{ item }}
        </li>
      </ol>
      <textarea
        class="dbs-back notes"
        v-model="textBlocks.dbsBack"
        placeholder="Write your notes for Look Back here"
      ></textarea>

      <h2 class="ltr dbs">{{ commonContent.look_up.title }}</h2>
      <h3 class="dbs">{{ readInstruction }}</h3>
      <ol class="ltr dbs">
        <li v-for="(item, index) in commonContent.look_up.question" :key="'up-' + index">
          {{ item }}
        </li>
      </ol>
      <textarea
        class="dbs-up notes"
        v-model="textBlocks.dbsUp"
        placeholder="Write your notes for Look Up here"
      ></textarea>

      <div class="bible-container">
        <div>
          <h3 class="dbs">{{ passageReference }}</h3>
        </div>
        <div v-html="lessonContent.bibleBlock.passage.passageText" class="bible-text"></div>
        <div>
          <a :href="lessonContent.bibleBlock.passage.passageUrl" class="readmore-button">
            {{ lessonContent.bibleBlock.translation.read_more }}
          </a>
        </div>
      </div>

      <h2 class="ltr dbs">{{ commonContent.look_forward.title }}</h2>
      <ol class="ltr dbs">
        <li v-for="(item, index) in commonContent.look_forward.question" :key="'forward-' + index">
          {{ item }}
        </li>
      </ol>
      <textarea
        class="dbs-forward notes"
        v-model="textBlocks.dbsForward"
        placeholder="Write your notes for Look Forward here"
      ></textarea>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useLanguageStore } from 'stores/LanguageStore';

export default {
  name: 'SeriesLessonContent',
  props: {
    languageCodeHL: {
      type: String,
      required: true,
    },
    study: {
      type: String,
      required: true,
    },
    lesson: {
      type: Number,
      required: true,
    },
    commonContent: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const languageStore = useLanguageStore();
    const lessonContent = ref(null);
    const textBlocks = ref({
      dbsBack: '',
      dbsUp: '',
      dbsForward: '',
    });
    const passageReference = ref('No reference found');
    const readInstruction = ref('');

    // Function to load lesson content
    const loadLessonContent = async () => {
      try {
        const content = await languageStore.loadLessonContent(
          props.languageCodeHL,
          props.study,
          props.lesson
        );
        lessonContent.value = content;
        updateReadInstruction();
      } catch (error) {
        console.error('Error loading lesson content:', error);
      }
    };

    // Function to extract and clean the passage reference
    const extractPassageReference = () => {
      const reference = lessonContent.value?.bibleBlock.passage.referenceLocalLanguage || '';
      const bibleReferenceRegex = /[A-Za-z]+\s\d+(:\d+(-\d+)?)?/;
      passageReference.value =
        reference.match(bibleReferenceRegex)?.[0] ||
        reference.split('\n').find((section) => section.trim()) ||
        'No reference found';
    };

    // Function to update the read instruction
    const updateReadInstruction = () => {
      extractPassageReference();
      const readTemplate = lessonContent.value?.bibleBlock.translation.read || '';
      readInstruction.value = readTemplate.replace('{{XXX}}', passageReference.value);
    };

    // Function to load notes from localStorage
    const loadLessonNotes = () => {
      const key = `${props.study}-${props.languageCodeHL}-${props.lesson}-notes`;
      const storedNotes = localStorage.getItem(key);
      if (storedNotes) {
        textBlocks.value = JSON.parse(storedNotes);
      }
    };

    // Watcher to save notes to localStorage on change
    watch(
      textBlocks,
      (newNotes) => {
        const key = `${props.study}-${props.languageCodeHL}-${props.lesson}-notes`;
        localStorage.setItem(key, JSON.stringify(newNotes));
      },
      { deep: true }
    );

    // Watcher to reload content when props change
    watch(
      () => [props.languageCodeHL, props.study, props.lesson],
      () => {
        loadLessonContent();
        loadLessonNotes();
      }
    );

    onMounted(() => {
      loadLessonContent();
      loadLessonNotes();
    });

    return {
      lessonContent,
      textBlocks,
      passageReference,
      readInstruction,
    };
  },
};
</script>

<style scoped>
textarea {
  width: 100%;
  height: 100px;
  margin-top: 8px;
}
</style>
