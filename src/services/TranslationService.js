import { currentApi } from "boot/axios";

export async function getCommonContent(languageCodeHL, study) {
  const cacheKey = `${study}-${languageCodeHL}-commonContent`;

  // Try retrieving and parsing from localStorage
  const localStoredContent = localStorage.getItem(cacheKey);
  if (localStoredContent) {
    try {
      const parsed = JSON.parse(localStoredContent);

      // Ensure it's an object (not null, array, string, etc.)
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        console.log("Using valid cached CommonContent from localStorage.");
        return parsed;
      } else {
        console.warn("Invalid CommonContent structure in cache, will refetch.");
      }
    } catch (err) {
      console.warn("Error parsing cached CommonContent. Will refetch.", err);
    }
  }

  // Fetch from API if local data is missing or invalid
  const url = `/api/translate/commonContent/${languageCodeHL}/${study}`;
  console.log("Fetching CommonContent from API:", url);

  try {
    const response = await currentApi.get(url, { timeout: 10000 });
    console.log("Fetched CommonContent from", url);
    console.log(response);
    const data =
      typeof response.data === "string"
        ? JSON.parse(response.data.data)
        : response.data.data;
        console.log(data);
    if (data && typeof data === "object" && !Array.isArray(data)) {
      localStorage.setItem(cacheKey, JSON.stringify(data));
      console.log("Fetched and cached new CommonContent.");
      return data;
    } else {
      throw new Error("API returned invalid data format for CommonContent.");
    }
  } catch (error) {
    console.error(`Error fetching common content: ${error}`);
    throw error;
  }
}


// services/TranslationService.js
export async function getLessonContent(languageCodeHL, study, lesson) {
  const cacheKey = `${study}-${languageCodeHL}-${lesson}-lessonContent`;
  // Check local storage for cached content
  const localStoredContent = localStorage.getItem(cacheKey);
  if (localStoredContent) {
    console.log("Using cached content from localStorage for LessonContent.");
    return JSON.parse(localStoredContent);
  }

  // Fallback: API call if content is not found locally
  const url = `/api/translate/lessonContent/${languageCodeHL}/${study}/${lesson}`;
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

// services/TranslationService.js
export async function getJesusVideoUrls(languageCodeJF) {
  const cacheKey = `jvideo-${languageCodeJF}-videoUrls`;

  // Check local storage for cached content
  const localStoredContent = localStorage.getItem(cacheKey);

  if (localStoredContent) {
    console.log("Using cached content from localStorage for videoContent.");
    return JSON.parse(localStoredContent);
  }

  // Fallback: API call if content is not found locally
  const url = `api/translate/videoUrls/jvideo/${languageCodeJF}`;
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

