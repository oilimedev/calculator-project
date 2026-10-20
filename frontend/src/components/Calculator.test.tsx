import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Calculator from './Calculator';
import { calculate } from '../services/calculatorApi';

vi.mock('../services/calculatorApi', () => ({
	calculate: vi.fn(),
}));

const calculateMock = vi.mocked(calculate);

function displayValue() {
	return screen.getByLabelText('Calculator display').querySelector('.display__value');
}

afterEach(cleanup);

beforeEach(() => {
	calculateMock.mockReset();
});

describe('Calculator', () => {
	it('submits a binary expression and displays its result', async () => {
		calculateMock.mockResolvedValue({ result: 15 });
		render(<Calculator />);

		for (const key of ['1', '2', '+', '3']) {
			fireEvent.click(screen.getByRole('button', { name: key }));
		}
		expect(screen.getByText('12 + 3')).toBeTruthy();
		fireEvent.click(screen.getByRole('button', { name: 'Equals' }));

		await waitFor(() => expect(displayValue()?.textContent).toBe('15'));
		expect(calculateMock).toHaveBeenCalledWith({ left: 12, operator: '+', right: 3 });
		expect(screen.getByText('12 + 3 =')).toBeTruthy();
	});

	it('calculates a percentage from the first value and base value', async () => {
		calculateMock.mockResolvedValue({ result: 2.5 });
		render(<Calculator />);

		for (const key of ['1', '0']) {
			fireEvent.click(screen.getByRole('button', { name: key }));
		}
		fireEvent.click(screen.getByRole('button', { name: 'Percentage' }));
		for (const key of ['2', '5']) {
			fireEvent.click(screen.getByRole('button', { name: key }));
		}
		fireEvent.click(screen.getByRole('button', { name: 'Equals' }));

		await waitFor(() => expect(displayValue()?.textContent).toBe('2.5'));
		expect(calculateMock).toHaveBeenCalledWith({ left: 10, operator: 'percentage', right: 25 });
		expect(screen.getByText('10 % 25 =')).toBeTruthy();
	});

	it('accepts keyboard input and backspace', () => {
		render(<Calculator />);

		for (const key of ['1', '2', '3', 'Backspace']) {
			fireEvent.keyDown(window, { key });
		}

		expect(displayValue()?.textContent).toBe('12');
	});

	it('shows an error when the API rejects a calculation', async () => {
		calculateMock.mockRejectedValue(new Error('Division by zero.'));
		render(<Calculator />);

		fireEvent.click(screen.getByRole('button', { name: '8' }));
		fireEvent.click(screen.getByRole('button', { name: 'Divide' }));
		fireEvent.click(screen.getByRole('button', { name: '0' }));
		fireEvent.click(screen.getByRole('button', { name: 'Equals' }));

		await waitFor(() => expect(displayValue()?.textContent).toBe('Error'));
	});
});