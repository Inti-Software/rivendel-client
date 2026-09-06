import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import HardBreak from "@tiptap/extension-hard-break";
import History from "@tiptap/extension-history";
import { useCallback } from "react";
import DOMPurify from "dompurify"; // Importamos DOMPurify
import './rich-text-editor.css';

const EXTENSIONS = [Document, Paragraph, Text, Bold, HardBreak, History];
const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

// Función de sanitización con DOMPurify
function cleanPastedHTML(html) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'strong', 'b', 'br'],
    ALLOWED_ATTR: [], 
  });
}

export default function RichTextEditor({ initialContent, onChange, visible = true }) {
  const editor = useEditor({
    extensions: EXTENSIONS,
    content: initialContent ?? EMPTY_DOC,
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getJSON());
    },
    editorProps: {
      attributes: { class: "rte-content", spellcheck: "true" },
      // Usamos la función sanitizadora aquí
      transformPastedHTML: (html) => cleanPastedHTML(html),
    },
  });

  const { isBold } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor.isActive("bold"),
    }),
  });

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  if (!editor || !visible) return null;

  return (
    <div className="rte-wrapper border border-1 bg-secondary-subtle rounded-2 border-dark p-1">
      <div className="rounded-2 d-flex ps-2 py-1" style={{ backgroundColor: '#dadada' }} role="toolbar" aria-label="Formato de texto">
        <button 
          type="button" 
          onClick={toggleBold} 
          aria-pressed={isBold} 
          data-bs-toggle="button" 
          className="btn btn-outline-dark rte-btn" 
          title="Negrita (Ctrl+B)" 
        >
          <strong>Negrita</strong>
        </button>
      </div>
      <EditorContent editor={editor} className="bg-white mt-1 border border-dark-subtle" />
    </div>
  );
}