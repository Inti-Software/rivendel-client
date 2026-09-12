import { EditorContent } from '@tiptap/react';
import './rich-text-editor.css';
import ClausulasTemplateFormDialog from '../Reclamos/components/ClausulasTemplateFormDialog';
import useRichTextEditor from './hooks/useRichTextEditor';
import { fillTemplate } from './editor.utils';

export default function RichTextEditor({ initialContent, documentFields, onChange }) {

  const { editor, showClausulasFieldsDialog, isBold, clausulasFields, setShowClausulasFieldsDialog, 
    toggleBold, updateTemplate } = useRichTextEditor(initialContent, documentFields, onChange);

  return (
    <div className="rte-wrapper border border-1 bg-secondary-subtle rounded-2 border-dark p-1">
      <ClausulasTemplateFormDialog 
        onAccept={(e, state) => updateTemplate(fillTemplate(state))} 
        onCancel={() => updateTemplate(null) } 
        defaultValues={clausulasFields} 
        visible={showClausulasFieldsDialog} 
      />
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
          onClick={() => updateTemplate(fillTemplate(null))}
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
          onClick={() => setShowClausulasFieldsDialog(true)}
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
