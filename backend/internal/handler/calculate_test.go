package handler

import (
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
		})
	}
}
