// DocumentEditorPage.jsx
// Integración: carga el documento existente, permite editarlo y lo persiste
// contra el endpoint NestJS con debounce para no pegarle a la API en cada tecla.

import { useEffect, useRef, useState } from "react";
import { RichTextEditor } from "./RichTextEditor";
import "./rich-text-editor.css";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export function DocumentEditorPage({ documentId }) {
  const [content, setContent] = useState(undefined);
  const [status, setStatus] = useState("loading"); // "loading" | "idle" | "saving" | "saved" | "error"
  const debounceRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/documents/${documentId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((doc) => {
        if (!cancelled) {
          setContent(doc.content);
          setStatus("idle");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [documentId]);

  const handleChange = (doc) => {
    setContent(doc);
    setStatus("saving");

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/documents/${documentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: doc }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    }, 800);
  };

  if (status === "loading") return <p>Cargando documento...</p>;

  return (
    <div>
      <RichTextEditor
        initialContent={content}
        onChange={handleChange}
        readOnly={status === "saving"}
      />
      <p style={{ fontSize: 13, color: "#888", marginTop: 8 }}>
        {status === "saving" && "Guardando..."}
        {status === "saved" && "Guardado"}
        {status === "error" && "Error al guardar"}
      </p>
      <a href={`${API_BASE}/documents/${documentId}/pdf`} target="_blank" rel="noreferrer">
        Descargar PDF
      </a>
    </div>
  );
}
