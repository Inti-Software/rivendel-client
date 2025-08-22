import { useNotification } from "../contexts/Constants";

const NotificationDisplay = () => {
  const { notification, hideNotification } = useNotification();
  if (!notification.visible) return null;

  return (
    <div
      className={`alert alert-${notification.type} d-flex align-items-center`}
    >
      {notification.message}
      <button onClick={hideNotification}>&times;</button>
    </div>
  );
};

export default NotificationDisplay;
