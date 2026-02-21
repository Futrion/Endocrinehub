import { CalculatorGrid } from "../basic/Layout";
import { LinkMediaCard } from "../basic/Layout";

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
                <LinkMediaCard 
                icon="/src/assets/icons/probiotic.png"
                title="Fórmulas enterales"
                link="/enterales"
                >
                </LinkMediaCard>
            </>
        }>

        </CalculatorGrid>
    )
}