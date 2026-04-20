import { computeSimilitud } from '../similitud.js';

export function recomendarEnterales(data, catalog) {

    const tgtKcal = parseFloat(data.kcal_day) || 0;
    const tgtProt = parseFloat(data.protein_day) || 0;
    const maxUnits= parseInt(data.max_containers_per_product);
    const perfil  = data.patology;
    const fsel    = data.fiber;
    const solo    = data.compatible_only;
    const hasTargets = tgtKcal > 0 || tgtProt > 0;

    if (!maxUnits || maxUnits <= 0) { return []; }

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
        if (!hasTargets) {
            units = maxUnits;
        } else {
            while (units<maxUnits){
                const needK = tgtKcal>0 && remK>tgtKcal*flexMargin;
                const needP = tgtProt>0 && remP>tgtProt*flexMargin;
                if (!needK && !needP) break;
                units++; remK-=it.kcal; remP-=it.protein_g;
            }
        }
        // Check if still within 10% of targets
        const withinK = tgtKcal>0 ? (Math.abs(remK) <= tgtKcal*flexMargin) : true;
        const withinP = tgtProt>0 ? (Math.abs(remP) <= tgtProt*flexMargin) : true;    
        
        if (units>0 && withinK && withinP) {
            const sim_kcal = computeSimilitud(tgtKcal, units*it.kcal);
            const sim_protein = computeSimilitud(tgtProt, units*it.protein_g);
            const toSim = s => s ? Math.max(0, 100 - s.deviationPct) : null;
            const simVals = [toSim(sim_kcal), toSim(sim_protein)].filter(x => x !== null);
            const media = simVals.length ? simVals.reduce((a, b) => a + b, 0) / simVals.length : null;
            picks.push({
                id: it.id,
                name: it.name,
                units,
                kcal_total: units*it.kcal,
                protein_g_total: units*it.protein_g,
                volume_ml_total: units*it.volume,
                sim_kcal,
                sim_protein,
                media,
            });
        }
    }

    if (hasTargets) {
        const avgDev = p => {
            const sims = [p.sim_kcal, p.sim_protein].filter(Boolean);
            return sims.length ? sims.reduce((s, x) => s + x.deviationPct, 0) / sims.length : Infinity;
        };
        picks.sort((a, b) => avgDev(a) - avgDev(b));
    }

    return picks;

}