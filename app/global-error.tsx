"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#FEFCF8", color: "#1B4332", padding: 24, fontFamily: "system-ui, sans-serif" }}>
          <section style={{ maxWidth: 440, border: "1px solid rgba(45,106,79,0.16)", borderRadius: 16, background: "#fff", padding: 24, textAlign: "center", boxShadow: "0 18px 45px rgba(27,67,50,0.10)" }}>
            <p style={{ margin: 0, color: "#2D6A4F", fontSize: 13, fontWeight: 700, textTransform: "uppercase" }}>Nurturely paused</p>
            <h1 style={{ margin: "12px 0 0", fontSize: 26 }}>We hit a rough patch.</h1>
            <p style={{ margin: "12px 0 0", color: "#6B7280", lineHeight: 1.6 }}>Refresh or try again in a moment. The app caught the error instead of leaving you on a blank page.</p>
            {error.digest ? <p style={{ margin: "12px 0 0", color: "#6B7280", fontSize: 12 }}>Reference: {error.digest}</p> : null}
            <button onClick={reset} style={{ marginTop: 20, border: 0, borderRadius: 8, background: "#2D6A4F", color: "#fff", padding: "10px 16px", fontWeight: 700 }}>Try again</button>
          </section>
        </main>
      </body>
    </html>
  );
}
