<template>
  <q-page class="bg-white" padding>
    <p>{{ $t("index.para1") }}</p>
    <p>{{ $t("index.para2") }}</p>
    <table>
      <tr class="full-width">
        <td
          class="side-by-side"
          @click="handleImageClick('/source')"
          clickable
          v-ripple
        >
          <img class="menu_picture" src="menu/source.webp" />
        </td>
        <td
          class="side-by-side"
          @click="handleImageClick('/wisdom/life')"
          clickable
          v-ripple
        >
          <img class="menu_picture" src="menu/wisdom.webp" />
        </td>
      </tr>
      <tr class="full-width">
        <td
          class="side-by-side"
          @click="handleImageClick('/wisdom/dbs')"
          clickable
          v-ripple
        >
          <img class="menu_picture" src="menu/grand.webp" />
        </td>

        <td
          class="side-by-side"
          @click="openExternalWebsite()"
          clickable
          v-ripple
        >
          <img class="menu_picture" src="menu/discover.webp" />
        </td>
      </tr>
    </table>
    <br />
    <br />
  </q-page>
</template>

<script>
import { legacyApi, currentApi } from "boot/axios";
import { useLanguageStore } from "stores/LanguageStore";
export default {
  name: "IndexPage",
  data() {
    return {
      selected: null,
    };
  },
  setup() {
    const languageStore = useLanguageStore();
    return {
      languageStore,
    };
  },
  methods: {
    handleImageClick(to) {
      // Handle the click event, e.g., navigate to the specified route
      this.$router.push(to);
    },
    openExternalWebsite() {
      var url = "api/ask/" + this.languageStore.getLanguageCodeHLSelected;
      console.log(url);
      legacyApi.get(url).then((response) => {
        var externalURL = "https://www.everyperson.com/contact.php";
        if (typeof response.data.contactPage != "undefined") {
          externalURL = response.data.contactPage;
        }
        window.open(externalURL, "_blank");
      });
    },
  },
};
</script>
<style scoped>
.menu_item {
  margin-left: 10px;
  margin-right: 10px;
  max-width: 200px;
  width: calc(100% - 20px);
  margin: 0 auto;
  background-color: #f0f0f0; /* Just for visibility */
  padding: 10px; /* Optional: Add padding for content within the element */
}
.menu_picture {
  width: calc(100% - 10px);
  margin: 0 auto;
  background-color: #eee; /* Just for visibility */
  padding: 10px; /* Optional: Add padding for content within the element */
}
td.side-by-side {
  width: 45%;
  padding: 0px;
}
tr.full-width {
  width: 100%;
}
</style>
