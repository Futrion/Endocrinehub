export function recomendarEnterales(data, catalog) {

    const tgtKcal = parseFloat(data.kcal_day);
    const tgtProt = parseFloat(data.protein_day);
    const maxUnits= parseInt(data.max_containers_per_product);
    const horas   = parseFloat(data.perfusion_hours);
    const perfil  = data.patology;
    const fsel    = data.fiber;
    const solo    = data.compatible_only;

    if (tgtKcal<=0 && tgtProt<=0) return alert('Indica objetivo (kcal o proteína)');
    if (!(horas>0)) return alert('Indica horas de perfusión (>0)');

    // filtro por perfil
    let pool = catalog;
    if (solo && perfil!=='general') pool = pool.filter(p => (p.tags||[]).includes(perfil));
    // filtro por fibra
    pool = pool.filter(p=>{
    const g = Number(p.fiber_g||0), t=(p.fiber_type||'desconocida').toLowerCase();
    switch (fsel){
        case 'sin_fibra':   return g===0 || t==='sin';
        case 'con_fibra':   return g>0 || (t!=='sin' && t!=='desconocida');
        case 'soluble':     return t==='soluble';
        case 'insoluble':   return t==='insoluble';
        case 'mixta':       return t==='mixta';
        case 'alta':        return g>=5;
        default: return true;
    }
    });
    if (pool.length===0){ return []; }

    // ordenar por densidad proteica y kcal/ml
    const items = pool.map(s=>({ ...s,
    kcal_per_ml: (s.kcal||0)/(s.vol_ml||1),
    prot_per_100kcal: (s.protein_g||0)/((s.kcal||1)/100)
    })).sort((a,b)=> (b.prot_per_100kcal - a.prot_per_100kcal) || (b.kcal_per_ml - a.kcal_per_ml));

    // Filter items that fit the requirements
    const picks=[];
    const flexMargin = 0.2; // 20% margin
    for (const it of items){
        // Reset values
        let units=0;
        let remK=tgtKcal, remP=tgtProt;
        // Loop while targets not met and units < maxUnits
        while (units<maxUnits){
            const needK = tgtKcal>0 && remK>tgtKcal*flexMargin;
            const needP = tgtProt>0 && remP>tgtProt*flexMargin;
            if (!needK && !needP) break;
            units++; remK-=it.kcal; remP-=it.protein_g;
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
                    volume_ml_total: units*it.volume
                }
            )
        }
    }

    return picks;

}