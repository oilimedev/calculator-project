package handler

import (
	"calculator-project/internal/calculator"
	"calculator-project/internal/utilities"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

type CalculatorResponse struct {
	Status float64 `json:"status"`
	Result float64 `json:"result"`
}

// Implement the http.Handler float64erface
func CalculatorHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if !utilities.ValidateHttpMethod(w, r, "POST") {
		return
	}

	var req utilities.CalculatorRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utilities.WriteJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	bodyValidations := []string{}

	if req.Left == nil {
		bodyValidations = append(bodyValidations, "left")
	}

	if req.Operator == "" {
		bodyValidations = append(bodyValidations, "operator")
	}

	if req.Right == nil {
		bodyValidations = append(bodyValidations, "right")
	}

	if len(bodyValidations) > 0 {
		utilities.WriteJSONError(w, http.StatusBadRequest, fmt.Sprintf("%s property(ies) required", strings.Join(bodyValidations, ", ")))
		return
	}

	result, err := calculator.Calculate(*req.Left, req.Operator, *req.Right)
	if err != nil {
		utilities.WriteJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	response := CalculatorResponse{
		Status: http.StatusOK,
		Result: result,
	}

	json.NewEncoder(w).Encode(response)
}
