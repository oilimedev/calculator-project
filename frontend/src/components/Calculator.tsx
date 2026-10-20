import { useEffect, useEffectEvent, useState } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import { calculate, type Operator } from '../services/calculatorApi';

type BinaryOperator = Extract<Operator, '+' | '-' | '*' | '/' | '^' | 'percentage'>;

export default function Calculator() {
	const [display, setDisplay] = useState('0');
	const [expression, setExpression] = useState('');
	const [storedValue, setStoredValue] = useState<number | null>(null);
	const [pendingOperator, setPendingOperator] = useState<BinaryOperator | null>(null);
	const [waitingForValue, setWaitingForValue] = useState(false);
	const [isCalculating, setIsCalculating] = useState(false);

	const runCalculation = async (left: number, operator: Operator, right: number, nextExpression: string) => {
		setIsCalculating(true);
		try {
			const { result } = await calculate({ left, operator, right });
			setDisplay(String(result));
			setExpression(nextExpression);
			setWaitingForValue(true);
			return true;
		} catch (error) {
			setDisplay('Error');
			setWaitingForValue(true);
			window.alert(error instanceof Error ? error.message : 'Calculation failed.');
			return false;
		} finally {
			setIsCalculating(false);
		}
	};

	const handleKeyPress = async (key: string) => {
		if (isCalculating) return;

		if (key === 'C' || key === 'AC') {
			setDisplay('0');
			setExpression('');
			setStoredValue(null);
			setPendingOperator(null);
			setWaitingForValue(false);
			return;
		}

		if (key === 'backspace') {
			if (waitingForValue) {
				setDisplay('0');
				setWaitingForValue(false);
				return;
			}
			const nextDisplay = display.length <= 1 || display === 'Error' ? '0' : display.slice(0, -1);
			setDisplay(nextDisplay);
			if (storedValue !== null && pendingOperator !== null) {
				setExpression(`${storedValue} ${pendingOperator} ${nextDisplay}`);
			} else {
				setExpression('');
			}
			return;
		}

		if (/^\d$/.test(key)) {
			const nextDisplay = waitingForValue || display === '0' || display === 'Error' ? key : display + key;
			setDisplay(nextDisplay);
			if (storedValue !== null && pendingOperator !== null) {
				setExpression(`${storedValue} ${pendingOperator} ${nextDisplay}`);
			} else {
				setExpression('');
			}
			setWaitingForValue(false);
			return;
		}

		const currentValue = Number(display);
		if (key === '^2' || key === 'sqrt') {
			const operator: Operator = key === '^2' ? '^' : 'sqrt';
			const right = key === '^2' ? 2 : 0;
			const unaryExpression = key === '^2' ? `${display}\u00b2 =` : `\u221a(${display}) =`;
			await runCalculation(currentValue, operator, right, unaryExpression);
			return;
		}

		if (key === '=') {
			if (pendingOperator === null || storedValue === null || waitingForValue) return;
			const expressionOperator = pendingOperator === 'percentage' ? '%' : pendingOperator;
			const nextExpression = `${storedValue} ${expressionOperator} ${display} =`;
			const succeeded = await runCalculation(storedValue, pendingOperator, currentValue, nextExpression);
			if (succeeded) {
				setStoredValue(null);
				setPendingOperator(null);
			}
			return;
		}

		if (['+', '-', '*', '/', '^', '%'].includes(key)) {
			setStoredValue(currentValue);
			setPendingOperator(key === '%' ? 'percentage' : key as BinaryOperator);
			setExpression(`${display} ${key}`);
			setWaitingForValue(true);
		}
	};

	const handlePhysicalKeyDown = useEffectEvent((event: KeyboardEvent) => {
			const target = event.target;
			if (target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select, [contenteditable="true"]'))) {
				return;
			}
			if (event.key === 'Enter' && target instanceof HTMLButtonElement) return;

			const key = /^\d$/.test(event.key) || ['+', '-', '*', '/', '^', '%'].includes(event.key)
				? event.key
				: event.key === 'Enter' || event.key === '=' ? '='
				: event.key === 'Backspace' ? 'backspace'
				: event.key === 'Escape' ? 'AC'
				: event.key === 'Delete' || event.key.toLowerCase() === 'c' ? 'C'
				: event.key.toLowerCase() === 'q' ? '^2'
				: event.key.toLowerCase() === 's' ? 'sqrt'
				: null;

			if (key === null) return;
			event.preventDefault();
			void handleKeyPress(key);
	});

	useEffect(() => {
		const listener = (event: KeyboardEvent) => handlePhysicalKeyDown(event);
		window.addEventListener('keydown', listener);
		return () => window.removeEventListener('keydown', listener);
	}, []);

	return (
		<main className="calculator" aria-label="Calculator">
			<header className="calculator__header">
				<div>
					<h1 className="calculator__title">Calculator</h1>
				</div>
				<span className="calculator__status" aria-hidden="true" />
			</header>
			<Display value={display} expression={expression} />
			<Keypad onButtonClick={handleKeyPress} />
		</main>
	);
}
