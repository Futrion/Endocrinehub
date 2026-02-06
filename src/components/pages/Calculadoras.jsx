import { CalculadoraIMC, CalculadoraGET, CalculadoraNPT, CalculadoraREQ } from "../calculators/Genericas";
import { CalculatorGrid } from "../basic/Layout";

export function Calculadoras() {
    return (
        <CalculatorGrid cols={2} 
            children={
                <>
                <CalculadoraIMC />
                <CalculadoraGET />
                <CalculadoraNPT />
                <CalculadoraREQ />
                </>
            }>
        </CalculatorGrid>
    );
}