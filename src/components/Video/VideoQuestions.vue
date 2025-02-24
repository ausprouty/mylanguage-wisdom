<template>
  <div>
    <ol class="ltr dbs">
      <li
        v-for="(item, index) in commonContent.question"
        :key="'question-' + index"
      >
        {{ item }}
      </li>
    </ol>
    <textarea
      class="jvideo notes"
      v-model="textBlocks.video"
      placeholder="Write your notes for this video here"
    ></textarea>
  </div>
</template>
