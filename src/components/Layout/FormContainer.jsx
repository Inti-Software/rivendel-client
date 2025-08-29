import ErrorMessage from "../Shared/ErrorMessage";
import useDocumentTitle from "./DocumentTitle";

const FormContainer = ({ title, error, handleSubmit, body }) => {
  useDocumentTitle({ title });

  return (
    <div className="container col-md-6 text-justify-center">
      <h2>{title}</h2>
      <ErrorMessage errors={error} />
      <form onSubmit={handleSubmit}>{body}</form>
    </div>
  );
};

export default FormContainer;
