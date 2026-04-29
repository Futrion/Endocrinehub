import { CalculatorGrid } from "../basic/Layout";
import { LinkMediaCard } from "../basic/Layout";
import calculatorIcon from "../../assets/icons/calcular.png";
import suplementosIcon from "../../assets/icons/yogurt.png";
import enteralesIcon from "../../assets/icons/probiotic.png";
import parenteralesIcon from "../../assets/icons/saline.png";

export function Calculadoras() {
    return (
        <CalculatorGrid cols={3}>
            <LinkMediaCard icon={calculatorIcon} title="Calculadoras Genéricas" link="/genericas" />
            <LinkMediaCard icon={suplementosIcon} title="Recomendador de suplementos orales" link="/suplementos" />
            <LinkMediaCard icon={enteralesIcon} title="Fórmulas enterales" link="/enterales" />
            <LinkMediaCard icon={parenteralesIcon} title="Comparador de nutrición parenteral tricameral" link="/parenterales" />
        </CalculatorGrid>
    )
}