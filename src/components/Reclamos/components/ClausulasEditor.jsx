import { lazy, Suspense } from 'react';
import Spinner from "../../Shared/Spinner";
import { ACUERDO } from "../tiposResoluciones";

const RichTextEditor = lazy(() => import('../../CustomTipTap/RichTextEditor'));

export default function ClausulasEditor({ state, setField }) {
	console.log("ClausulasEditor state:", state);
	console.log("ClausulasEditor setField:", setField);

  if (state.idResolucion !== ACUERDO) return null;

  return (
    <div className="mb-3">
      <div className="mb-3">
        <span className="h5 text-primary">Cláusulas</span>
      </div>
      <Suspense fallback={<Spinner />}>
        <RichTextEditor
          initialContent={state.clausulas}
          onChange={(doc) => setField('clausulas', doc)}
          visible={state.idResolucion === ACUERDO}
        />
      </Suspense>
    </div>
  );
}
