package utilities

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestValidateHttpMethod(t *testing.T) {

	tests := []struct {
		name          string
		method        string
		allowedMethod string
		want          bool
	}{
		{"valid method", "GET", "GET", true},
		{"invalid method", "POST", "GET", false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req, err := http.NewRequest(tt.method, "/", nil)
			if err != nil {
				t.Fatalf("could not create request: %v", err)
			}
			w := httptest.NewRecorder()
			got := ValidateHttpMethod(w, req, tt.allowedMethod)
			if got != tt.want {
				t.Errorf("ValidateHttpMethod() = %v, want %v", got, tt.want)
			}
		})
	}
}
