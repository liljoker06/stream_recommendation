import { sendUserEvent } from "../services/kafkaProducer.js";

const VALID_EVENTS = [
  "view_film_page",
  "view_category",
  "open_trailer",
  "play",
  "duration_seconds",
  "repeat_view"
];

export const handleEvent = async (req, res) => {
  try {
    const { event_type, timestamp, user_id } = req.body;

    if (!event_type || !timestamp || !user_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!VALID_EVENTS.includes(event_type)) {
      return res.status(400).json({ error: "Invalid event type" });
    }

    if (event_type === "duration_seconds" && (!req.body.duration_seconds || req.body.duration_seconds < 3)) {
      return res.status(200).json({ ignored: true });
    }

    await sendUserEvent(req.body);

    return res.status(201).json({ status: "ok" });
  } catch (err) {
    console.error("❌ Error handleEvent:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
