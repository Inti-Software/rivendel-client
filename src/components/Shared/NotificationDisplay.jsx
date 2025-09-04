import { useNotification } from "../../contexts/Constants";

const NotificationDisplay = () => {
  const { notification } = useNotification();

	const backgroundColor = notification.type === "danger" ? "text-bg-danger" : "text-bg-information";

	return (
    <div className="row" style={{ minHeight: "30px" }}>
			{notification.visible && (
				<div id="mensaje" className="d-flex justify-content-between align-items-center">
					<span className={`badge m-auto p-2 fw-normal ${backgroundColor}`}>
						{notification.message || "No hay mensajes"}
					</span>				
			</div>
			)}
    </div>
  );
};

export default NotificationDisplay;
