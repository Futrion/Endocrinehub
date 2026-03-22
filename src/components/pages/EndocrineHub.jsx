import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Forward } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import endocrinehub_cover from "../../assets/images/endocrinehub_cover.png";

export function EndocrineHub() {
    return (
        <Card className="rounded-xl p-4 md:p-8 max-w-2xl self-center">
            <Typography variant="h1" className="mb-4 text-center">Bienvenido a EndocrineHub</Typography>
            <Typography variant="body1" className="text-left text-lg">
                Tu portal de herramientas prácticas para endocrinología y nutrición clínica.
                Aquí encontrarás calculadoras, recomendadores y recursos diseñados para facilitar
                tu práctica clínica diaria, con un enfoque accesible y en permanente evolución.
            </Typography>
            <CardMedia
                component="img"
                image={endocrinehub_cover}
                alt="EndocrineHub Cover"
                className="mt-6 rounded-lg shadow-md"
            />
            <CardActions className="mt-4">
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Button variant="contained" color="primary" size="large" component={RouterLink} to="/calculadoras" endIcon={<Forward size={16} />}>
                        Explorar calculadoras
                    </Button>
                </Box>
            </CardActions>
        </Card>
    );
}
