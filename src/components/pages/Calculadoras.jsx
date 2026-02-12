import { CalculatorGrid, CalculatorSection } from "../basic/Layout";
import { LinkMediaCard } from "../basic/Layout";
import { Genericas } from "./Genericas";

export function Calculadoras() {
    return (
        <CalculatorGrid cols={3} children={
            <>
                <LinkMediaCard 
                icon="/src/assets/icons/calcular.png"
                title="Calculadoras Genéricas"
                link="/genericas"
                >
                </LinkMediaCard>
                <LinkMediaCard 
                icon="/src/assets/icons/yogurt.png"
                title="Recomendador de suplementos orales"
                link="/suplementos"
                >
                </LinkMediaCard>
            </>
        }>

        </CalculatorGrid>
    )
}