import { useEditor, useEditorState } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { EXTENSIONS, EMPTY_DOC, cleanPastedHTML } from '../editor.utils';

export default function useRichTextEditor(initialContent, documentFields, onChange) {
  const [showClausulasDialog, setShowClausulasDialog] = useState(false);
  const [clausulasFields, setClausulasFields] = useState({
    reclamado: '',
    rubros: '',
    reclamante: {
      dni: 0,
      nombre: '',
    },
  });

  useEffect(() => {
    setClausulasFields(documentFields);
  }, [documentFields]);

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
    editor?.chain().focus().clearContent().run();
    editor?.chain().focus().insertContent(sanitizedTemplate).run();
  }, [editor]);

  return {
    editor,
    showClausulasDialog,
    isBold,
    setShowClausulasDialog,
    clausulasFields,
    toggleBold,
    pasteTemplate,
  };
}
