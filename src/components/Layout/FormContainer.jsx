import ValidationErrors from "../Shared/ValidationErrors";
import useDocumentTitle from "./DocumentTitle";

const FormContainer = ({ title, error, handleSubmit, body }) => {
  useDocumentTitle({ title });

  return (
    <div className="container col-md-6 text-justify-center mb-2">
      <h2>{title}</h2>
      <ValidationErrors errors={error} />
      <form onSubmit={handleSubmit}>{body}</form>
    </div>
  );
};

export default FormContainer;
