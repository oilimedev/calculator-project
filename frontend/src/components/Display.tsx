export default function Display({ value, expression }: { value: string; expression: string }) {

    return (
        <div className="display" aria-live="polite" aria-label="Calculator display">
            {expression && <span className="display__expression">{expression}</span>}
            <span className="display__value">{value}</span>
        </div>
    );
}