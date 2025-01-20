<template>
  <div v-html = "this.questions" >
  </div>
</template>
<script>
import { api } from "boot/axios";
export default {
  name: 'FollowingHimQuestions',
  props:{
    languageCodeHL: String,
  },
  data() {
    return {
      questions : '',
    };
  },
  watch: {
    languageCodeHL: function (newLanguage, oldLanguage) {
      if (newLanguage !== oldLanguage) {
        this.showQuestions(newLanguage);
      }
    }
  },
  methods:{
    showQuestions(languageCodeHL){
      var url = 'api/jvideo/questions/'+ languageCodeHL
      console.log (url)
      api.get(url).then((response) => {
        console.log (response)
        this.questions = response.data;
      });
    }

  },
 created(){
  this.showQuestions(this.languageCodeHL)
 }

}
</script>
