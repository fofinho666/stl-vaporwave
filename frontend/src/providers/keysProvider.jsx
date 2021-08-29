import React, { createContext, useContext, useEffect, useState } from "react"
import useKeyPress from "../hooks/useKeyPress"

export const KeysContext = createContext()

export function useKeys() {
  return useContext(KeysContext)
}

export default function KeysPovider({ children }) {
  const cameraKeypress = useKeyPress("c");
  const reloadKeypress = useKeyPress("r");
  const backgroundKeypress = useKeyPress("b");

  return (
    < KeysContext.Provider value={{ cameraKeypress, reloadKeypress, backgroundKeypress }} >
      {children}
    </KeysContext.Provider >
  )
}