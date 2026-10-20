package utilities

import "net/http"

type CalculatorRequest struct {
	Left     *float64 `json:"left"`
	Operator string   `json:"operator"`
	Right    *float64 `json:"right"`
}

func ValidateHttpMethod(w http.ResponseWriter, r *http.Request, allowedMethod string) bool {
	if r.Method != allowedMethod {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return false
	}
	return true
}
