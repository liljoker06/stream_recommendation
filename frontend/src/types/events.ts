// Types de base pour tous les événements

export type BaseEvent = {
  user_id: string;
  timestamp?: string;
  device?: string;
};

// Informations sur un contenu

export type ContentInfo = {
  content_id: string;
  tags?: string[];
  [key: string]: unknown;
};


// Evénement lié à un contenu


export type ContentEvent = BaseEvent & {
  content: ContentInfo;
};


// Evénement lié à une catégorie

export type CategoryEvent = BaseEvent & {
  category: string;
};

// Liste stricte des types d'évènements


export type EventType =
  | "view_film_page"
  | "view_category"
  | "open_trailer"
  | "play"
  | "repeat_view"
  | "duration_seconds";


// Payload générique envoyé au backend

export type EventPayload = {
  event_type: EventType;
  user_id: string;

  timestamp?: string;
  device?: string;

  content?: ContentInfo;
  category?: string;

  duration_seconds?: number;
};
