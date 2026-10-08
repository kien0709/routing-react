import { isAxiosError } from "axios";

// haalt de foutmelding uit een django rest framework response
export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (isAxiosError(error)) {
    const data = error.response?.data;

    if (data && typeof data === "object") {
      if (typeof data.detail === "string") return data.detail;

      const first = Object.values(data)[0];
      if (Array.isArray(first) && typeof first[0] === "string") return first[0];
      if (typeof first === "string") return first;
    }
  }

  return fallback;
}

// maakt van een fout een titel en uitleg die we aan de gebruiker kunnen laten zien
export function describeError(error: unknown) {
  if (isAxiosError(error)) {
    // geen response betekent dat de server niet bereikbaar is backend staat uit of geen internet
    if (!error.response) {
      return {
        title: "Can't reach the server",
        description: "Check your internet connection or make sure the backend is running.",
      };
    }

    switch (error.response.status) {
      case 401:
        return { title: "Your session has expired", description: "Please log in again." };
      case 403:
        return {
          title: "You don't have access",
          description: getErrorMessage(error, "You are not allowed to view this."),
        };
      case 404:
        return { title: "Not found", description: "This item doesn't exist or was deleted." };
    }
  }

  return { title: "Something went wrong", description: getErrorMessage(error) };
}
