import { defineStore } from "pinia";
import { getCommonContent } from 'src/services/TranslationService';

export const useLanguageStore = defineStore("languageStore", {
  state: () => ({
    commonContent: {}, // Will store content by language and study
    lifeLesson:null,
    leadershipLesson: null,
    grandStoryLesson: null,
    followingHimSegment: null,
    jVideoSegmentId: null,
    // you record the languageCodeHL here so you only get
    // new titles for the Jesus video when
    // languageSelected.languageCodeHL changes
    jVideoSegments:{
      languageCodeHL: 'eng00',
      languageCodeJF: '529',
      segments:[]
    },
    languages: [],
    languageSelected: {
      languageCodeHL: 'eng00',
      languageCodeJF: 529,
      value: 3
    },
    previousPage: '/index'
  }),
  getters: {
    getDbsLesson: (state) => {
      if (state.dbsLesson == null || typeof state.dbsLesson == 'undefined'){
        state.dbsLesson = localStorage.getItem("dbsLesson", 1)
      }
      return parseInt(state.dbsLesson,10)
    },
    getFollowingHimSegment: (state) => {
      if (state.followingHimSegment  == null || typeof state.followingHimSegment == 'undefined'){
        state.followingHimSegment = localStorage.getItem("followingHimSegment", '1-0-0')
      }
      return state.followingHimSegment
    },
    getLifeLesson: (state) => {
      if (state.lifeLesson == null || typeof state.lifeLesson == 'undefined'){
        state.lifeLesson = localStorage.getItem("lifeLesson", 1)
      }
      return state.lifeLesson
    },

    getJVideoSegmentId: (state) => {
      if (state.jVideoSegmentId  == null || typeof state.jVideoSegmentId == 'undefined'){
        console.log ('getting jvideoSegmentId from local storage')
        state.jVideoSegmentId = localStorage.getItem("jVideoSegmentId", 1)
      }
      return state.jVideoSegmentId
    },
    getJVideoSegments: (state) => {
      if (state.jVideoSegments == null || typeof state.jVideoSegments == 'undefined'){
        var local = localStorage.getItem("jVideoSegments");
        if (local  && local != 'undefined'){
          state.jVideoSegments = JSON.parse(local)
        }
        else{
          state.jVideoSegments = null;
        }
      }
      return state.jVideoSegments
    },
    getLanguageCodeHLSelected: (state) => {
      if (!state.languageSelected) {
        // Attempt to retrieve from localStorage or fall back to the default
        let local = localStorage.getItem("languageSelected");

        if (local) {
          try {
            state.languageSelected = JSON.parse(local);
          } catch (e) {
            console.error("Failed to parse languageSelected from localStorage", e);
            // Set default if parsing fails
            state.languageSelected = { languageCodeHL: 'eng00' };
          }
        } else {
          // Set default if nothing is found in localStorage
          state.languageSelected = { languageCodeHL: 'eng00',"languageCodeJF":529 };
        }
      }

      // Ensure a valid return value
      const languageCodeHL = state.languageSelected?.languageCodeHL || 'eng00';
      console.log('getLanguageCodeHLSelected says ' + languageCodeHL);
      return languageCodeHL;
    },

    getLanguageCodeJFSelected: (state) => {
      if (state.languageSelected == null){
        var local = localStorage.getItem("languageSelected", '{"languageSelected":{"languageCodeHL":"eng00","languageCodeJF":529}}');
          state.languageSelected = JSON.parse(local)
      }
      return state.languageSelected.languageCodeJF
    },

    getLanguageSelected: (state) => {
      if (state.languageSelected == null){
        var local = localStorage.getItem("languageSelected", '{"languageSelected":{"languageCodeHL":"eng00","languageCodeJF":529,  "value": 3}}');
          state.languageSelected = JSON.parse(local)
      }
      return state.languageSelected
    },
    getLanguageValue: (state) => {
      if (state.languageSelected == null){
        var local = localStorage.getItem("languageSelected", '{"languageSelected":{"languageCodeHL":"eng00","languageCodeJF":529, "value": 3}}');
          state.languageSelected = JSON.parse(local)
      }
      return state.languageSelected.value
    },

    getLeadershipLesson: (state) => {
      if (state.leadershipLesson  == null || typeof state.leadershipLesson  == 'undefined'){
        state.leadershipLesson = localStorage.getItem("leadershipLesson", 1)
      }
      return state.leadershipLesson
    },

    getPreviousPage: (state) => {
      var selected = localStorage.getItem("previousPage", '/index');
      return selected
    },
  },

  actions :{
    async loadCommonContent(language, study) {
      // Avoid re-fetching if the content is already loaded
      if (this.commonContent[language]?.[study]) {
        return this.commonContent[language][study];
      }
      // Fetch commonContent from service
      const content = await getCommonContent(language, study);
      // Store it in the state
      if (!this.commonContent[language]) {
        this.commonContent[language] = {};
      }
      this.commonContent[language][study] = content;
      return content;
    },
    updateDbsLesson(newValue) {
      if (newValue > 0 && newValue < 24){
        localStorage.setItem('dbsLesson', newValue);
        this.dbsLesson = newValue;
      }

    },
    updateFollowingHimSegment(newValue) {
      localStorage.setItem('followingHimSegment', newValue);
      this.followingHimSegment = newValue;
    },
    updateLifeLesson(newValue) {
      if (newValue > 0 &&  newValue < 24){
        localStorage.setItem('lifeLesson', newValue);
        this.lifeLesson = newValue;
      }

    },
    updateJVideoSegmentId(newValue) {
      if (newValue != null){
        if (newValue > 0 && newValue < 62){
          localStorage.setItem('jVideoSegmentId', newValue);
          this.jVideoSegmentId = newValue;
        }
      }
    },
    updateJVideoSegments(languageCodeHL, languageCodeJF, segments){
      var jVideoSegments ={ }
      jVideoSegments.languageCodeHL = languageCodeHL
      jVideoSegments.languageCodeJF = languageCodeJF
      jVideoSegments.segments = segments;
      localStorage.setItem('jVideoSegments', JSON.stringify(jVideoSegments));
      this.jVideoSegments = jVideoSegments
    },
    updateLanguages(newValue) {
      var languages = JSON.stringify(newValue);
      localStorage.setItem('languages', languages);
      this.languages = languages;
    },
    updateLanguageCodeHLSelected(languageCodeHL){
      this.languageSelected.languageCodeHL = languageCodeHL;
      localStorage.setItem('languageSelected', JSON.stringify(this.languageSelected));
    },
    updateLanguageCodeJFSelected(languageCodeJF){
      this.languageSelected.languageCodeJF = languageCodeJF;
      localStorage.setItem('languageSelected', JSON.stringify(this.languageSelected));
    },
    updateLanguageSelected(languageCodeHL, languageCodeJF){
      this.languageSelected.languageCodeHL = languageCodeHL;
      this.languageSelected.languageCodeJF = languageCodeJF;
      localStorage.setItem('languageSelected', JSON.stringify(this.languageSelected));
    },
    updateLeadershipLesson(newValue) {
      if (newValue > 0 && newValue < 24){
        localStorage.setItem('leadershipLesson', newValue);
        this.leadershipLesson = newValue;
      }
    },
    updatePreviousPage(newValue) {
      localStorage.set("previousPage", newValue);

    },
  }
});



