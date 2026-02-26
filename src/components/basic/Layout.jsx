import { Card, CardActionArea, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export function CalculatorSection({ children, className = '' }) {
    return (
        // <div className="bg-tertiary rounded-xl p-8 max-w-md">
        //     {children}
        // </div>
        <Card className={`bg-tertiary rounded-xl p-8 ${className}`}>
            {children}
        </Card>
    );
}

export function CalculatorInnerDivider({ children, className = '' }) {
    return (
        <Box className={`border border-gray-300 rounded-lg grow p-4 mt-4 ${className}`}>
            {children}
        </Box>
    );
}

export function LinkMediaCard({ icon, title, link }) {
    return (    
        <Card className="bg-tertiary rounded-xl max-w-md h-full">
            <CardActionArea component={RouterLink} to={link} className="p-8 flex flex-col items-center h-full">
                <CardMedia
                    component="img"
                    image={icon}
                    alt={title}
                    style={{
                        width: '128px',
                        height: '128px',
                        objectFit: 'contain',
                    }}
                />
                <CardContent className="p-0 mt-4">
                    <Typography gutterBottom variant="h3" component="div" className="text-center">
                        {title}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export function CalculatorGrid({ children, cols = 2, className = '' }) {
    const colsMap = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
        5: 'md:grid-cols-5',
        6: 'md:grid-cols-6',
    };

    return (
        // <div className={`grid gap-8 p-8 rounded-xl bg-white ${colsMap[cols] || colsMap[2]}`}>
        //     {children}
        // </div>
        <Card className={`grid gap-8 p-8 rounded-xl bg-white items-stretch ${className} ${colsMap[cols] || colsMap[2]}`}>
            {children}
        </Card>
    );
}