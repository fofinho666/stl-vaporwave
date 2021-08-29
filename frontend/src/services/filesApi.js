const fetchFiles = () => fetch("/api/files").then(res => res.json())

export const getFiles = () => fetchFiles().then(
  (files) => {
    if (!files) {
      return []
    }
    return files.map(
      (file) => `/api/files/${file.filename}`
    )
  }
)

export const postFiles = (files) => {
  const formData = new FormData()
  files.map((file) => formData.append("files", file))  

  return fetch("/api/files", { method: 'POST', body: formData })
}
