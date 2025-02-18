import { currentApi } from "boot/axios";

// services/TranslationService.js
export async function getCommonContent(language, study) {
  const cacheKey = `${study}-${language}-commonContent`;

  // Check local storage for cached content
  const localStoredContent = localStorage.getItem(cacheKey);
  if (localStoredContent) {
    console.log("Using cached content from localStorage for CommonContent.");
    var parsed = JSON.parse(localStoredContent);
    console.log (parsed.topic);
    return parsed;
  }

  // Fallback: API call if content is not found locally
  const url = `/api/translate/commonContent/${language}/${study}`;
  console.log("Fetching CommonContent from API:", url);

  try {
    const response = await currentApi.get(url, { timeout: 10000 });

    // Check if the response is already an object or needs parsing
    const data =
      typeof response.data === "string"
        ? JSON.parse(response.data.data)
        : response.data.data;

    console.log("Fetched data:", data);

    // Cache the content locally for future use
    localStorage.setItem(cacheKey, JSON.stringify(data));

    return data;
  } catch (error) {
    console.error(`Error fetching common content: ${error}`);
    throw error; // Rethrow to allow the caller to handle the error
  }
}

// services/TranslationService.js
export async function getLessonContent(language, study, lesson) {
  const cacheKey = `${study}-${language}-${lesson}-lessonContent`;
  // Check local storage for cached content
  const localStoredContent = localStorage.getItem(cacheKey);
  if (localStoredContent) {
    console.log("Using cached content from localStorage for LessonContent.");
    return JSON.parse(localStoredContent);
  }

  // Fallback: API call if content is not found locally
  const url = `/api/translate/lessonContent/${language}/${study}/${lesson}`;
  console.log("Fetching lesson content from API:", url);

  try {
    const response = await currentApi.get(url, { timeout: 10000 });
    console.log (response)
    // Check if the response is already an object or needs parsing
    const data =
      typeof response.data === "string"
        ? JSON.parse(response.data.data)
        : response.data.data

    console.log("Fetched data:", data);

    // Cache the content locally for future use
    localStorage.setItem(cacheKey, JSON.stringify(data));

    return data;
  } catch (error) {
    console.error(`Error fetching lesson content: ${error}`);
    throw error; // Rethrow to allow the caller to handle the error
  }
}
