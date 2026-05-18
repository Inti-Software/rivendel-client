export const ProximaAudienciaInput = ({ visible, value, handleOnChange }) => {
  if (!visible) return null;
  return (
    <div className="col">
      <label htmlFor="proxAudiencia" className="form-label d-block">
        Próxima audiencia:
      </label>
      <input
        id="proxAudiencia"
        placeholder="AAAA-MM-DD HH:MM"
        className="form-control text-center d-inline-block w-auto"
        type="datetime-local"
        value={value}
        onChange={handleOnChange}
      />
    </div>
  );
};
