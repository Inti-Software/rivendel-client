import { useEditor as useTipTapEditor, useEditorState } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { EXTENSIONS, EMPTY_DOC, cleanPastedHTML } from '../editor.utils';

export default function useEditor(initialContent, documentFields, onChange) {
  const [showClausulasFieldsDialog, setShowClausulasFieldsDialog] = useState(false);
	
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

  const editor = useTipTapEditor({
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

	const updateContent = useCallback((template) => {
		if (template) {
			editor?.chain().focus().clearContent().run();
			editor?.chain().focus().insertContent(template).run();
      editor.commands.focus('start');
		}
	  setShowClausulasFieldsDialog(false);
	}, [editor]);

  return {
    editor,
    showClausulasFieldsDialog,
    isBold,
    clausulasFields,
		setShowClausulasFieldsDialog,
    toggleBold,
    updateContent
  };
}
