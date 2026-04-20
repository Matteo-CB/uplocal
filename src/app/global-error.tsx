"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="en" dir="ltr">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#F6F4F0",
          color: "#0A0A0A",
          fontFamily: "'Satoshi', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "2.5rem",
              fontWeight: 400,
              marginBottom: "1rem",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "#78716C",
              marginBottom: "2rem",
            }}
          >
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "48px",
              padding: "0 1.5rem",
              backgroundColor: "#C2410C",
              color: "#ffffff",
              fontSize: "0.875rem",
              fontWeight: 500,
              fontFamily: "'Satoshi', sans-serif",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
