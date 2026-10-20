package calculator

import (
	"math"
	"testing"
)

func TestCalculate(t *testing.T) {
	tests := []struct {
		name     string
		left     float64
		operator string
		right    float64
		want     float64
		wantErr  bool
	}{
		{"addition", 10, "+", 5, 15, false},
		{"subtraction", 10, "-", 5, 5, false},
		{"multiplication", 10, "*", 5, 50, false},
		{"division", 10, "/", 5, 2, false},
		{"division by zero", 10, "/", 0, 0, true},
		{"reminder", 10, "%", 4, 2, false},
		{"reminder by zero", 10, "%", 0, 0, true},
		{"exponentiation", 2, "^", 3, 8, false},
		{"square root", 16, "sqrt", 0, 4, false},
		{"square root of negative number", -16, "sqrt", 0, 0, true},
		{"percentage", 50, "percentage", 10, 5, false},
		{"addition overflow", math.MaxFloat64, "+", math.MaxFloat64, 0, true},
		{"multiplication overflow", math.MaxFloat64, "*", 2, 0, true},
		{"exponentiation overflow", 10, "^", 400, 0, true},
		{"unsupported operator", 10, "unsupported", 5, 0, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Calculate(
				tt.left, tt.operator, tt.right,
			)

			if (err != nil) != tt.wantErr {
				t.Fatalf("error = %v, wantErr %v", err, tt.wantErr)
			}

			if !tt.wantErr && got != tt.want {
				t.Errorf("got %v, want %v", got, tt.want)
			}
		})
	}
}
