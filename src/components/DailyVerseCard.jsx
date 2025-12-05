import React, { useEffect, useState } from "react";

export default function DailyVerseCard() {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVerse() {
      try {
        const response = await fetch("https://church-portal-backend.onrender.com/api/daily-verse/");
        const data = await response.json();
        setVerse(data);
      } catch (error) {
        setVerse({ error: "Unable to load verse right now." });
      } finally {
        setLoading(false);
      }
    }

    fetchVerse();
  }, []);

  return (
    <div className="card shadow-sm mx-auto mt-4" style={{ maxWidth: "600px" }}>
      <div className="card-body text-center">
        <h5 className="card-title mb-3">Daily Bible Verse</h5>

        {loading && (
          <p className="text-muted">Loading verse...</p>
        )}

        {!loading && verse?.error && (
          <p className="text-danger">{verse.error}</p>
        )}

        {!loading && verse && !verse.error && (
          <>
            <p className="card-text fst-italic">
              “{verse.text}”
            </p>
            <p className="text-muted fw-semibold mb-0">
              {verse.book} {verse.chapter}:{verse.verse}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
