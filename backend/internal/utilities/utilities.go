package utilities

import (
	"encoding/json"
	"net/http"
)

type CalculatorRequest struct {
	Left     *float64 `json:"left"`
	Operator string   `json:"operator"`
	Right    *float64 `json:"right"`
}

type ErrorResponse struct {
	Status int         `json:"status"`
	Error  ErrorDetail `json:"error"`
}

type ErrorDetail struct {
	Message string `json:"message"`
}

func WriteJSONError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(ErrorResponse{
		Status: status,
		Error:  ErrorDetail{Message: message},
	})
}

func ValidateHttpMethod(w http.ResponseWriter, r *http.Request, allowedMethod string) bool {
	if r.Method != allowedMethod {
		WriteJSONError(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return false
	}
	return true
}
