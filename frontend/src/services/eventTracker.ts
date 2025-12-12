import api from "./api";
import type { EventPayload, ContentEvent, CategoryEvent } from "../types/events";

console.log("%c[eventTracker] chargé ✔️", "color: #00ff00; font-weight: bold");
// Envoi générique d'un événement

async function sendEvent(eventData: EventPayload) {
  try {
    const response = await api.post("/events", {
      ...eventData,
      timestamp: new Date().toISOString(),
      device: navigator.userAgent,
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'événement :", error);
  }
}

// Fonctions événementielles

export const eventTracker = {
  viewFilmPage: (data: ContentEvent) =>
    sendEvent({ event_type: "view_film_page", ...data }),

  viewCategory: (data: CategoryEvent) =>
    sendEvent({ event_type: "view_category", ...data }),

  openTrailer: (data: ContentEvent) =>
    sendEvent({ event_type: "open_trailer", ...data }),

  playContent: (data: ContentEvent) =>
    sendEvent({ event_type: "play", ...data }),

  repeatView: (data: ContentEvent) =>
    sendEvent({ event_type: "repeat_view", ...data }),
};

// Gestion de la durée (timer)

let startTime: number | null = null;

export function startDurationTimer() {
  startTime = Date.now();
}

export function stopDurationTimer(data: ContentEvent) {
  if (!startTime) return;

  const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
  startTime = null;

  return sendEvent({
    event_type: "duration_seconds",
    duration_seconds: durationSeconds,
    ...data,
  });
}
