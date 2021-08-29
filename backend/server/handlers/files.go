package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"regexp"
)

func FilesIndex(w http.ResponseWriter, r *http.Request) {
	folder, err := os.Open(StorageFolder)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer folder.Close()

	files, err := folder.Readdir(-1)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var fileMaps []Map
	for _, file := range files {
		filename := file.Name()
		matched, _ := regexp.MatchString(`\.(?:stl)$`, filename)
		if !matched {
			continue
		}
		fileMap := Map{"filename": filename, "size": file.Size()}
		fileMaps = append(fileMaps, fileMap)
	}
	payload, err := json.Marshal(fileMaps)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(payload)
}

func FilesCreate(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(100000)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	//get a ref to the parsed multipart form
	m := r.MultipartForm

	//get the *fileheaders
	files := m.File["files"]
	for i, _ := range files {
		//for each fileheader, get a handle to the actual file
		file, err := files[i].Open()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer file.Close()
		//create destination file making sure the path is writeable.
		filePath := StorageFolder + "/" + files[i].Filename
		dst, err := os.Create(filePath)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer dst.Close()
		//copy the uploaded file to the destination file
		if _, err := io.Copy(dst, file); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
