import { useEffect, useRef, useState } from "react";

import Toast from "../components/Toast";

const useToast = () => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const [showToast, setShowToast] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (showToast) {
      timer.current = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    return () => clearTimeout(timer.current);
  }, [showToast, message]);

  const showToastMessage = (newMsg, newType = "success") => {
    setMessage(newMsg);
    setType(newType);
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return {
    showToastMessage,
    Toast: (
      <Toast
        message={message}
        type={type}
        onClose={handleCloseToast}
        showToast={showToast}
      />
    ),
  };
};

export default useToast;
