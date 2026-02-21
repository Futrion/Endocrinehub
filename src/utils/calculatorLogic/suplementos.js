export function recomendarSuplementos(data, catalog){
    const perfil = data.patology;
    const perfilFibra = data.fiber;
    const soloCompatibles = data.compatible_only;

    const tgtKcal = data.kcal_day;
    const tgtProt = data.protein_day;

    const maxUnits = data.max_containers_per_product;

    if (tgtKcal<=0 && tgtProt<=0){ return []; }

    // filtrar por perfil
    let pool = catalog;
    if (soloCompatibles && perfil!=='general') pool = pool.filter(p => (p.tags||[]).includes(perfil));
    // filtrar por fibra
    pool = pool.filter(p => {
    const g = Number(p.fiber_g || 0);
    const t = (p.fiber_type || 'desconocida').toLowerCase();
    switch (perfilFibra) {
        case 'sin_fibra':   return g === 0 || t === 'sin';
        case 'con_fibra':   return g > 0 || (t !== 'sin' && t !== 'desconocida');
        case 'soluble':     return t === 'soluble';
        case 'insoluble':   return t === 'insoluble';
        case 'mixta':       return t === 'mixta';
        case 'alta':        return g >= 5;
        default: return true;
    }
    });

    if (pool.length===0){ return []; }

    // ordenar por densidad proteica (g/100kcal), luego por kcal/envase
    const items = pool.map(s=>({...s, prot_per_100kcal: s.protein_g/(s.kcal/100)}))
                    .sort((a,b)=> (b.prot_per_100kcal - a.prot_per_100kcal) || (b.kcal - a.kcal));

    // Filter items that fit the requirements
    const picks = [];
    const flexMargin = 0.2; // 20% margin
    for (const it of items){
    // Reset values
    let units = 0;
    let remK = tgtKcal, remP = tgtProt;
    // Loop while targets not met and units < maxUnits
    while (units < maxUnits){
        const needK = tgtKcal>0 && remK>tgtKcal*flexMargin;
        const needP = tgtProt>0 && remP>tgtProt*flexMargin;
        if (!needK && !needP) break;
        units++; remK -= it.kcal; remP -= it.protein_g;
    }
    // Check if still within 10% of targets
    const withinK = tgtKcal>0 ? (Math.abs(remK) <= tgtKcal*flexMargin) : true;
    const withinP = tgtProt>0 ? (Math.abs(remP) <= tgtProt*flexMargin) : true;    
    if (units>0 && withinK && withinP) {
            picks.push(
                {
                    id: it.id,
                    name: it.name,
                    units: units,
                    kcal_total: units*it.kcal,
                    protein_g_total: units*it.protein_g,
                    carbs_g_total: units*it.carbs_g,
                    lipids_g_total: units*it.lipids_g,
                }
            );
        }
    }

    // let sumK=0,sumP=0;

    // const defK = tgtKcal>0 ? Math.max(0, tgtKcal - sumK) : 0;
    // const defP = tgtProt>0 ? Math.max(0, tgtProt - sumP) : 0;
    // let msg = `Perfil: ${perfil} | Fibra: ${perfilFibra}. Objetivo: ${tgtKcal||'—'} kcal / ${tgtProt||'—'} g proteína. `+
    //         `Propuesto: ${fmt0(sumK)} kcal / ${fmt1(sumP)} g.`;
    // if (defK>0 || defP>0) msg += ` Déficit → ${defK>0?fmt0(defK)+' kcal':''}${defK>0&&defP>0?' · ':''}${defP>0?fmt1(defP)+' g prot.':''}`;
    // else msg += ' ✅ Objetivos cubiertos o superados.';
    // document.getElementById('supp_deficit').textContent = msg;
    // document.getElementById('supp_results').style.display = 'block';

    return picks;
}