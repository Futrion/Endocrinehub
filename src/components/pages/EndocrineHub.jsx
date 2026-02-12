import { CalculatorGrid } from "../basic/Layout";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Forward } from "lucide-react";
import CardActionArea from "@mui/material/CardActionArea";

export function EndocrineHub() {
    return (
        <Card className="rounded-xl p-8 max-w-2xl">
            <Typography variant="h1" className="mb-4 text-center">Bienvenido a EndocrineHub</Typography>
            <Typography variant="body1" className="text-justify text-lg">Tu portal de herramientas y apuntes para endocrinología. Este espacio está diseñado para todos los endocrinólogos que buscan herramientas prácticas y actualizadas para su día a día. Aquí encontrarás recursos creados específicamente para facilitar la práctica clínica, optimizar la toma de decisiones y apoyar la formación continua en endocrinología. Nuestra página se enriquece de manera constante con nuevos apuntes, guías y utilidades que reflejan los avances más recientes en la especialidad, con un enfoque práctico y accesible. El objetivo es construir, junto a la comunidad de endocrinólogos, un lugar de referencia útil, dinámico y en permanente evolución.</Typography>
            <CardMedia
                component="img"
                image="/src/assets/images/endocrinehub_cover.png"
                alt="EndocrineHub Cover"
                className="mt-6 rounded-lg shadow-md"
            />
            <CardActions className="mt-4">
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Button color="primary" href="/calculadoras" className="hover:scale-105" endIcon={<Forward size={16} />}>
                        Explorar calculadoras
                    </Button>
                </Box>
            </CardActions>
        </Card>
    );
}