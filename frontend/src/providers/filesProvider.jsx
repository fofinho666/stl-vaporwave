import React, { createContext, useContext, useEffect, useState } from "react"
import { getFiles } from "../services/filesApi"

export const FilesContext = createContext()

export function useFiles() {
  return useContext(FilesContext)
}

export default function JobPovider({ children }) {
  const [files, setFiles] = useState([])
  const loadFiles = () => { getFiles().then(setFiles) }
  const reloadFiles = () => {
    setFiles([])
    loadFiles()
  }

  useEffect(() => { loadFiles() }, [])

  return (
    <FilesContext.Provider value={{ files, reloadFiles }} >
      {children}
    </FilesContext.Provider>
  )
}
