 // ====== CALCULADORAS ORIGINALES ======
    document.getElementById('imcForm').onsubmit = e => {
      e.preventDefault();
      const p = parseFloat(peso.value), h = parseFloat(altura.value)/100;
      const imc = p/(h*h); resultadoIMC.textContent = 'IMC: '+imc.toFixed(2);
    };
    document.getElementById('getForm').onsubmit = e => {
      e.preventDefault();
      const p = +pesoGET.value, a = +alturaGET.value, ed = +edadGET.value, sx = sexoGET.value;
      const get = (sx==='hombre') ? 10*p + 6.25*a - 5*ed + 5 : 10*p + 6.25*a - 5*ed - 161;
      resultadoGET.textContent = 'GET (kcal/día): '+Math.round(get);
    };
    document.getElementById('nptForm').onsubmit = e => {
      e.preventDefault();
      const p = +pesoNPT.value, kcalkg = +calorias.value, prokg = +proteinas.value;
      if (!p || !kcalkg || !prokg) return alert('Parámetros inválidos');
      const kcalTot = p * kcalkg, gAA = p * prokg, gN2 = gAA / 6.25;
      const kcalAA = gAA * 4, kcalNoProt = Math.max(0, kcalTot - kcalAA);
      const kcalLip = kcalNoProt * 0.4, kcalGlu = kcalNoProt * 0.6;
      const gramosLipidos = Math.round(kcalLip / 10);
      const gramosGlucosa = Math.round(kcalGlu / 4);
      resultadoNPT.innerHTML = `<h3>Informe de Formulación NPT</h3><ul>
        <li>Peso: ${p} kg</li><li>Aminoácidos: ${gAA.toFixed(0)} g (${gN2.toFixed(0)} g N2)</li>
        <li>Lípidos: ${gramosLipidos} g</li><li>Glucosa: ${gramosGlucosa} g</li>
        <li>Kcal totales: ${kcalTot.toFixed(0)} kcal</li></ul>`;
    };
    function calcular(){
      let durs=[12,16,20], tasas=[5,6], tasaL=0.11, out='', imcCorte=30;
      const gen=genero.value, ed=+edad.value, serv=servicio.value, ph=+pesoHabitual.value, pa=+pesoActual.value, tM=+talla.value/100, tCM=+talla.value;
      if (!pa) return alert('Peso actual inválido');
      let imc=pa/(tM*tM), perd=((ph-pa)/ph)*100, pi=calcularPesoIdeal(tCM,gen), paj=pi+0.25*(pa-pi), pcalc=(imc>=imcCorte)?paj:pa;
      const reqE={k25:25*pcalc,k30:30*pcalc}, reqP={p12:1.2*pcalc,p15:1.5*pcalc};
      durs.forEach(d=>{ tasas.forEach(t=>{ out+=`<p>Glucosa ${t} mg/kg/min, ${d}h: ${(t*60*pa*d/1000).toFixed(2)} g</p>`; });
        out+=`<p>Lípidos ${tasaL} g/kg/h, ${d}h: ${(tasaL*pa*d).toFixed(2)} g</p><hr>`; });
      resultados.innerHTML=`<h3>Resultados:</h3>
        <p><strong>IMC:</strong> ${imc.toFixed(2)} kg/m²</p>
        <p><strong>% pérdida peso:</strong> ${perd.toFixed(2)}%</p>
        <p><strong>Requerimientos energéticos:</strong></p>
        <ul><li>25 kcal/kg: ${reqE.k25.toFixed(0)} kcal</li><li>30 kcal/kg: ${reqE.k30.toFixed(0)} kcal</li></ul>
        <p><strong>Requerimientos proteicos:</strong></p>
        <ul><li>1.2 g/kg: ${reqP.p12.toFixed(1)} g</li><li>1.5 g/kg: ${reqP.p15.toFixed(1)} g</li></ul>
        <h4>Tasas máximas de infusión:</h4>${out}`;
    }
    function calcularPesoIdeal(tCM,gen){ return (gen==='hombre')? 50+2.3*((tCM/2.54)-60) : 45.5+2.3*((tCM/2.54)-60); }