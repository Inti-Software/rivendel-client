const ErrorMessage = ({ errors }) => {
  if (!errors) return null;

  console.log("errors: " + errors)
  
  return (
    <div className="card border-danger p-2 m-md-4">
      <ul className="mb-0">
        {errors.map((err, index) => (
          <li key={index} className="text-danger">
            {err}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorMessage;