import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import HardBreak from '@tiptap/extension-hard-break';
import History from '@tiptap/extension-history';
import { useCallback, useState } from 'react';
import DOMPurify from 'dompurify';
import './rich-text-editor.css';
import plantillaHtmlInicial from '../../assets/clausulas-template.html?raw';
import ClausulasTemplateFormDialog from '../Reclamos/components/ClausulasTemplateFormDialog';

const EXTENSIONS = [Document, Paragraph, Text, Bold, HardBreak, History];
const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph' }] };

function cleanPastedHTML(html) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'strong', 'b', 'br'],
    ALLOWED_ATTR: [],
  });
}

export default function RichTextEditor({ initialContent, onChange, visible = true }) {
  const [showClausulasDialog, setShowClausulasDialog] = useState(false);

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: initialContent ?? EMPTY_DOC,
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getJSON());
    },
    editorProps: {
      attributes: { class: 'rte-content', spellcheck: 'true' },
      transformPastedHTML: (html) => cleanPastedHTML(html),
    },
  });

  const { isBold } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor.isActive('bold'),
    }),
  });

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const pasteTemplate = useCallback(() => {
    const sanitizedTemplate = cleanPastedHTML(plantillaHtmlInicial)
      //eliminar saltos de línea y reemplazarlos por un solo espacio
      .replace(/\n/g, ' ')
      //eliminar dos espacios seguidos y reemplazarlos por un solo espacio
      .replace(/ {2,}/g, ' ')
      //eliminar todos los espacios al inicio de cada línea y reemplazarlos por un solo espacio
      .replace(/^\s+/gm, ' ')
      //eliminar tabulaciones y reemplazarlas por un solo espacio
      .replace(/\t/g, ' ')
      //eliminar todos los espacios antes y después de <br/> y reemplazarlos por vacío
      .replace(/ *<br\/?> */g, '<br/>')
      //eliminar espacios al inicio y al final
      .trim();
    editor?.chain().focus().clearContent().run();
    editor?.chain().focus().insertContent(sanitizedTemplate).run();
  }, [editor]);

  function onAcceptClausulasFormDialog(e, fields) {
    setShowClausulasDialog(false);
    console.log('onAcceptClausulasFormDialog', fields);
  }

  function onCancelClausulasFormDialog() {
    setShowClausulasDialog(false);
  }

  if (!editor || !visible) return null;

  return (
    <div className="rte-wrapper border border-1 bg-secondary-subtle rounded-2 border-dark p-1">
      <ClausulasTemplateFormDialog onAccept={onAcceptClausulasFormDialog} onCancel={onCancelClausulasFormDialog} visible={showClausulasDialog} />
      <div
        className="rounded-2 d-flex ps-2 py-1"
        style={{ backgroundColor: '#dadada' }}
        role="toolbar"
        aria-label="Formato de texto"
      >
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
        <button
          type="button"
          onClick={pasteTemplate}
          className="btn btn-outline-dark rte-btn ms-1"
          title="Insertar plantilla"
        >
          <span>Insertar plantilla</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().clearContent().run()}
          className="btn btn-outline-dark rte-btn ms-1"
          title="Limpiar contenido"
        >
          <span>Limpiar contenido</span>
        </button>
        <button
          type="button"
          onClick={() => setShowClausulasDialog(true)}
          className="btn btn-outline-dark rte-btn ms-1"
          title="Insertar plantilla desde formulario"
        >
          <span>Insertar plantilla desde formulario</span>
        </button>
      </div>
      <EditorContent editor={editor} className="bg-white mt-1 border border-dark-subtle" />
    </div>
  );
}
