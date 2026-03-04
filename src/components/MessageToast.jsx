import { useSelector } from "react-redux";

function MessageToast() {
  const messages = useSelector((state) => state.message);
  return (
    <div className="toast-container">
      {messages.map((message) => (
        <div
          key={message.id}
          className="toast show"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className={`toast-header text-white bg-${message.type}`}>
            <img src="..." className="rounded me-2" alt="..." />
            <strong className="me-auto">{message.title}</strong>
            <small>11 mins ago</small>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">{message.text}</div>
        </div>
      ))}
    </div>
  );
}

export default MessageToast;
