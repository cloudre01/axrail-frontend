import { createContext } from "react";

import useToast from "../hooks/useToast";

export const ToasterContext = createContext(null);

export function ToasterProvider({ children }) {
  const { Toast, showToastMessage } = useToast();

  return (
    <ToasterContext.Provider value={showToastMessage}>
      {children}
      {Toast}
    </ToasterContext.Provider>
  );
}
