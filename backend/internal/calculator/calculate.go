package calculator

import (
	"fmt"
	"math"
)

func Calculate(left float64, operator string, right float64) (float64, error) {
	var result float64

	switch operator {
	case "+":
		result = left + right
	case "-":
		result = left - right
	case "*":
		result = left * right
	case "/":
		if right == 0 {
			return 0, fmt.Errorf("Division by zero.")
		}
		result = left / right
	case "%":
		if right == 0 {
			return 0, fmt.Errorf("Division by zero.")
		}
		result = math.Mod(left, right)
	case "^":
		result = math.Pow(left, right)
	case "sqrt":
		if left < 0 {
			return 0, fmt.Errorf("Square root of negative number.")
		}
		result = math.Sqrt(left)
	case "percentage":
		result = right * (left / 100)
	default:
		return 0, fmt.Errorf("Unsupported operator: %s", operator)
	}

	if math.IsInf(result, 0) || math.IsNaN(result) {
		return 0, fmt.Errorf("Result is out of range.")
	}
	return result, nil
}
