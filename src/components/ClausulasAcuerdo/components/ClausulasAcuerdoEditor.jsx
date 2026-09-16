import { lazy, Suspense } from 'react';
import Spinner from "../../Shared/Spinner";

const Editor = lazy(() => import('./Editor'));

export default function ClausulasAcuerdoEditor({ content, visible, reclamo, onContentChange }) {
  if (!visible) return null;

  return (
    <div className="mb-3">
      <div className="mb-3">
        <span className="h5 text-primary">Cláusulas</span>
      </div>
      <Suspense fallback={<Spinner />}>
        <Editor initialContent={content} onChange={onContentChange} documentFields={reclamo} />
      </Suspense>
    </div>
  );
}
