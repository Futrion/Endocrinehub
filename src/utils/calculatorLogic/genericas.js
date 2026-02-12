export function calcularIMC(data) {
    const heightInMeters = parseFloat(data.height) / 100;
    const calculatedImc = parseFloat(data.weight) / (heightInMeters * heightInMeters);
    const imc = calculatedImc.toFixed(2);
    return imc;
}

export function calcularGET(data) {
    const result = data.gender === 'hombre' ? 
        10*data.weight + 6.25*data.height - 5*data.age + 5
        :
        10*data.weight + 6.25*data.height - 5*data.age - 161;
    return result.toFixed(0);
}

export function calcularNPT(data) {
     const peso = parseFloat(data.weight);
    const kcalkg = parseFloat(data.calories);
    const prokg = parseFloat(data.proteins);

    const kcalTot = peso * kcalkg, gAA = peso * prokg, gN2 = gAA / 6.25;
    const kcalAA = gAA * 4, kcalNoProt = Math.max(0, kcalTot - kcalAA);
    const kcalLip = kcalNoProt * 0.4, kcalGlu = kcalNoProt * 0.6;
    const gramosLipidos = Math.round(kcalLip / 10);
    const gramosGlucosa = Math.round(kcalGlu / 4);

    return {
        peso: peso,
        aminoacidos: gAA.toFixed(0),
        nitrogeno: gN2.toFixed(0),
        lipidos: gramosLipidos,
        glucosa: gramosGlucosa,
        total: kcalTot.toFixed(0)
    };
}


const calcularPesoIdeal = (tCM, gen) => {
    return (gen === 'hombre')
        ? 50 + 2.3 * ((tCM / 2.54) - 60)
        : 45.5 + 2.3 * ((tCM / 2.54) - 60);
};

export function calcularREQ(data) {
    let durs = [12, 16, 20], tasas = [5, 6], tasaL = 0.11;
        const imcCorte = 30;
        const gen = data.gender;
        const ed = +data.age;       // Keep for future updates
        const serv = data.service;  // Keep for future updates
        const ph = +data.normalWeight;
        const pa = +data.currentWeight;
        const tM = +data.height / 100;
        const tCM = +data.height;

        if (!pa) {
            alert('Peso actual inválido');
            return;
        }

        let imc = pa / (tM * tM);
        let perd = ((ph - pa) / ph) * 100;
        let pi = calcularPesoIdeal(tCM, gen);
        let paj = pi + 0.25 * (pa - pi);
        let pcalc = (imc >= imcCorte) ? paj : pa;

        const reqE = { k25: 25 * pcalc, k30: 30 * pcalc };
        const reqP = { p12: 1.2 * pcalc, p15: 1.5 * pcalc };

        let infusionRates = [];
        durs.forEach(d => {
            let ratesForDuration = [];
            tasas.forEach(t => {
                ratesForDuration.push({
                    type: 'Glucosa',
                    rate: t,
                    amount: (t * 60 * pa * d / 1000).toFixed(2)
                });
            });
            ratesForDuration.push({
                type: 'Lípidos',
                rate: tasaL,
                amount: (tasaL * pa * d).toFixed(2)
            });
            infusionRates.push({
                duration: d,
                rates: ratesForDuration
            });
        });

        return {
            imc: imc.toFixed(2),
            perd: perd.toFixed(2),
            reqE,
            reqP,
            infusionRates
        };
}