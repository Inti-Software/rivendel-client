export default function DeleteMessage(nroMatricula, nombre) {
  return (
    <>
      ¿Está seguro de eliminar el siguiente patrocinante?
      <span className="fw-bold text-danger text-center d-block">
        {nroMatricula} - {nombre}
      </span>
      <span
        style={{ fontSize: "10px" }}
        className="text-secondary-subtle text-center pt-2 d-block"
      >
        Esta operación no se puede deshacer.
      </span>
    </>
  );
}
