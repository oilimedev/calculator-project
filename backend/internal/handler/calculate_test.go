package handler

import (
	"calculator-project/internal/utilities"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestCalculatorHandlerValidatesRequiredFields(t *testing.T) {
	tests := []struct {
		name       string
		method     string
		body       string
		wantStatus int
	}{
		{"missing left", http.MethodPost, `{"operator":"+","right":2}`, http.StatusBadRequest},
		{"missing operator", http.MethodPost, `{"left":1,"right":2}`, http.StatusBadRequest},
		{"missing right", http.MethodPost, `{"left":1,"operator":"+"}`, http.StatusBadRequest},
		{"invalid json", http.MethodPost, `{`, http.StatusBadRequest},
		{"zero values are present", http.MethodPost, `{"left":0,"operator":"+","right":0}`, http.StatusOK},
		{"wrong method", http.MethodGet, ``, http.StatusMethodNotAllowed},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			req := httptest.NewRequest(test.method, "/api/calculate", strings.NewReader(test.body))
			rec := httptest.NewRecorder()

			CalculatorHandler(rec, req)

			if rec.Code != test.wantStatus {
				t.Errorf("status = %d, want %d", rec.Code, test.wantStatus)
			}
			if contentType := rec.Header().Get("Content-Type"); contentType != "application/json" {
				t.Errorf("Content-Type = %q, want application/json", contentType)
			}
			if test.wantStatus >= http.StatusBadRequest {
				var response utilities.ErrorResponse
				if err := json.NewDecoder(rec.Body).Decode(&response); err != nil {
					t.Fatalf("error response is not valid JSON: %v", err)
				}
				if response.Status != test.wantStatus || response.Error.Message == "" {
					t.Errorf("error response = %+v, want status %d and a message", response, test.wantStatus)
				}
			}
		})
	}
}

func TestCalculatorHandlerReturnsCalculationErrorMessage(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/calculate", strings.NewReader(`{"left":1,"operator":"/","right":0}`))
	rec := httptest.NewRecorder()

	CalculatorHandler(rec, req)

	var response utilities.ErrorResponse
	if err := json.NewDecoder(rec.Body).Decode(&response); err != nil {
		t.Fatalf("error response is not valid JSON: %v", err)
	}
	if response.Error.Message != "Division by zero." {
		t.Errorf("error message = %q, want %q", response.Error.Message, "Division by zero.")
	}
}
