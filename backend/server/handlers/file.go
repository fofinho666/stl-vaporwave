package handlers

import (
	"net/http"
	"regexp"

	"github.com/gorilla/mux"
)

func FileIndex(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	filename := params["filename"]
	matched, _ := regexp.MatchString(`\.(?:stl)$`, filename)
	if !matched {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	filePath := StorageFolder + "/" + filename
	contentDisposition := "attachment; filename=" + filename

	w.Header().Set("Content-Type", "model/stl")
	w.Header().Set("Content-Disposition", contentDisposition)
	w.Header().Set("Access-Control-Allow-Origin", "*")

	http.ServeFile(w, r, filePath)
}
