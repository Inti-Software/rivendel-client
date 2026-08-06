export const removeParte = (id, isReclamante, state, setField) => {
  const partes = isReclamante ? state.reclamantes : state.reclamados;
  const f = isReclamante ? 'reclamantes' : 'reclamados';
  const v = partes.filter((p) => p.id !== id);
  setField(f, v);
};

export const setFieldParte = (field, value, parteId, esPatrocinante, esReclamante, state, setField) => {
  const partes = esReclamante ? state.reclamantes : state.reclamados;
  if (!partes || partes.length === 0) return null;
  const f = esReclamante ? 'reclamantes' : 'reclamados';
  const v = partes.map((p) => {
    if (p.id === parteId) {
      switch (field) {
        case 'nroWhatsapp':
          if (esPatrocinante) {
            return { ...p, nroWhatsappPatrocinante: value };
          } else {
            return { ...p, nroWhatsappParte: value };
          }
        case 'postergo':
          return { ...p, postergo: !p.postergo };
        case 'incomparendoParte':
          return { ...p, incomparendoParte: !p.incomparendoParte };
        case 'incomparendoPatrocinante':
          return { ...p, incomparendoPatrocinante: !p.incomparendoPatrocinante };
        case 'multado':
          return { ...p, multado: !p.multado };
        default:
          return p;
      }
    }
    return p;
  });
  setField(f, v);
};