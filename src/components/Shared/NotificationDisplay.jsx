import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationDisplay = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={true}
        theme="colored"
        transition={Bounce}
      />
    </>
  );
};

export default NotificationDisplay;
