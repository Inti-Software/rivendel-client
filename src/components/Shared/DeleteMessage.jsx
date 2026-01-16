export default function DeleteMessage({ message, fields }) {
  return (
    <>
      {message}
      <span className="fw-bold text-danger text-center d-block">
        {fields}
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
