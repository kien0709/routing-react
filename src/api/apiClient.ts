import axios, { isAxiosError } from "axios";
import { auth } from "../../config/firebase";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8001/api",
});

// https://axios.rest/pages/advanced/interceptors

// https://firebase.google.com/docs/auth/admin/verify-id-tokens#retrieve_id_tokens_on_clients
apiClient.interceptors.request.use(
  async function (config) {
    const user = auth.currentUser;

    if (user) {
      const idToken = await user.getIdToken();
      config.headers.Authorization = `Bearer ${idToken}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);


// authcontext geeft hier een functie door die uitlogt als de sessie echt verlopen is
let onSessionExpired: (() => void) | null = null;

export function setOnSessionExpired(handler: (() => void) | null) {
  onSessionExpired = handler;
}

apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const request = error.config;
    const user = auth.currentUser;

    // eerste keer 401 dan is het token waarschijnlijk verlopen dus nieuw token halen en opnieuw proberen
    if (error.response?.status === 401 && user && request && !request.retried) {
      request.retried = true;
      try {
        const idToken = await user.getIdToken(true);
        request.headers.Authorization = `Bearer ${idToken}`;
        return await apiClient(request);
      } catch (retryError) {
        // nieuw token ophalen lukt niet dus de sessie is voorbij
        if (!isAxiosError(retryError)) onSessionExpired?.();
        return Promise.reject(retryError);
      }
    }

    // nog steeds 401 met een nieuw token dan accepteert de backend ons niet meer dus uitloggen
    if (error.response?.status === 401 && user && request?.retried) {
      onSessionExpired?.();
    }

    return Promise.reject(error);
  },
);

export default apiClient;
