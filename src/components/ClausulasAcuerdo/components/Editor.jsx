import { EditorContent } from '@tiptap/react';
import '../editor.css';
import ClausulasTemplateFormDialog from './ClausulasTemplateFormDialog';
import useEditor from '../hooks/useEditor';
import { fillTemplate } from '../editor.utils';

export default function Editor({ initialContent, documentFields, onChange }) {

  const { editor, showClausulasFieldsDialog, isBold, setShowClausulasFieldsDialog, 
    toggleBold, updateContent } = useEditor(initialContent, onChange);

  return (
    <div className="rte-wrapper border border-1 bg-secondary-subtle rounded-2 border-dark p-1">
      <ClausulasTemplateFormDialog 
        onAccept={(e, state) => updateContent(fillTemplate(state))} 
        onCancel={() => updateContent(null) } 
        defaultValues={documentFields} 
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
          <span>Insertar plantilla</span>
        </button>
      </div>
      <EditorContent editor={editor} className="bg-white mt-1 border border-dark-subtle" />
    </div>
  );
}
