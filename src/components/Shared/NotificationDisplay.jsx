import { useNotification } from "../../contexts/Constants";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationDisplay = () => {
  const { notification } = useNotification();

  return (
    <>
      {notification.visible && (
        <ToastContainer
          position="top-right"
          autoClose={notification.duration}
          limit={1}
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
      )}
    </>
  );
};

export default NotificationDisplay;
