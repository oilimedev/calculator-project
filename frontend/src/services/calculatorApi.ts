export type Operator = "+" | "-" | "*" | "/" | "^" | "sqrt" | "percentage";

export interface CalculateRequest {
  left: number;
  operator: Operator;
  right: number;
}

export interface CalculateResponse {
  result: number;
}

export async function calculate(
  request: CalculateRequest
): Promise<CalculateResponse> {
  const response = await fetch("/api/calculate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const body = await response.text();
  let data: { result?: number; error?: { message?: string } } = {};
  try {
    data = JSON.parse(body) as typeof data;
  } catch {
    // The Go handler uses plain text for errors.
  }

  if (!response.ok) {
    throw new Error(
      data.error?.message ?? (body || "Calculation failed.")
    );
  }

  if (typeof data.result !== "number") {
    throw new Error("The calculator returned an invalid result.");
  }

  return { result: data.result };
}