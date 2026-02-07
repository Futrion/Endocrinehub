// import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";

export function CalculatorSection({ children }) {
    return (
        <div className="bg-tertiary rounded-xl p-8 max-w-md">
            {children}
        </div>
        // <Card className="bg-tertiary rounded-xl p-8 max-w-md">
        //     {children}
        // </Card>
    );
}

export function CalculatorGrid({ children, cols = 2 }) {
    const colsMap = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
        5: 'md:grid-cols-5',
        6: 'md:grid-cols-6',
    };

    return (
        <div className={`grid gap-8 p-8 rounded-xl bg-white ${colsMap[cols] || colsMap[2]}`}>
            {children}
        </div>
    );
}