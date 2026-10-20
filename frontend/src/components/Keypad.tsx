export default function Keypad({ onButtonClick }: { onButtonClick: (key: string) => void }) {
    const keys = [
        { label: 'AC', value: 'AC', kind: 'clear' },
        { label: 'C', value: 'C', kind: 'clear' },
        { label: '\u232b', value: 'backspace', kind: 'clear' },
        { label: '\u00f7', value: '/', kind: 'operator' },
        { label: '7', value: '7', kind: 'number' },
        { label: '8', value: '8', kind: 'number' },
        { label: '9', value: '9', kind: 'number' },
        { label: '\u00d7', value: '*', kind: 'operator' },
        { label: '4', value: '4', kind: 'number' },
        { label: '5', value: '5', kind: 'number' },
        { label: '6', value: '6', kind: 'number' },
        { label: '\u2212', value: '-', kind: 'operator' },
        { label: '1', value: '1', kind: 'number' },
        { label: '2', value: '2', kind: 'number' },
        { label: '3', value: '3', kind: 'number' },
        { label: '+', value: '+', kind: 'operator' },
        { label: '0', value: '0', kind: 'number' },
        { label: 'x\u02b8', value: '^', kind: 'operator' },
        { label: 'x\u00b2', value: '^2', kind: 'operator' },
        { label: '\u221a', value: 'sqrt', kind: 'operator' },
        { label: '%', value: '%', kind: 'operator' },
        { label: '=', value: '=', kind: 'equals' },
    ];

    return (
        <div className="keypad" role="group" aria-label="Calculator keypad">
            {keys.map((key) => (
                <button
                    className={`key key--${key.kind}`}
                    key={key.value}
                    type="button"
                    aria-label={
                        key.value === '/' ? 'Divide' :
                        key.value === '*' ? 'Multiply' :
                        key.value === '-' ? 'Subtract' :
                        key.value === '^' ? 'Exponent' :
                        key.value === '^2' ? 'Square' :
                        key.value === 'sqrt' ? 'Square root' :
                        key.value === '%' ? 'Percentage' :
                        key.value === 'backspace' ? 'Backspace' :
                        key.value === '=' ? 'Equals' :
                        key.label
                    }
                    onClick={() => onButtonClick(key.value)}
                >
                    {key.label}
                </button>
            ))}
        </div>
    );
}