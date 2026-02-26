export function calcularResultadosParenterales(data) {
    const peso = data.weight;
    const talla = data.height;
    const kcal_kg = data.kcal_kg_desired;
    const prot_kg = data.prot_kg_desired;
    const volumen = data.volume_total_ml;
    const horasRaw = data.infusion_hours;
    const horas = (isFinite(horasRaw) && horasRaw > 0) ? horasRaw : null;

    // TODO: añadir validación en vez de esto
    const carb_npc_pct = Math.min(100, Math.max(0, data.carb_npc_pct));
    const kcalg_aa = data.kcal_aa;
    const kcalg_cho = data.kcal_cho;
    const kcalg_fat = data.kcal_lipids;

    const gir_max = data.gir_max;
    const lip_max_day = data.lip_max_day;

    const imc = (talla > 0) ? peso / Math.pow(talla / 100, 2) : NaN;
    const prot_g = peso * prot_kg;
    const N_g = prot_g / 6.25;

    const kcal_tot = peso * kcal_kg;
    const kcal_prot = prot_g * kcalg_aa;
    const kcal_np = Math.max(0, kcal_tot - kcal_prot);

    const kcal_cho = kcal_np * (carb_npc_pct / 100);
    const kcal_fat = kcal_np - kcal_cho;

    const pct_aa = 100 * (kcal_prot / Math.max(1, kcal_tot));
    const pct_cho = 100 * (kcal_cho / Math.max(1, kcal_tot));
    const pct_fat = 100 * (kcal_fat / Math.max(1, kcal_tot));

    const cho_g = kcal_cho / kcalg_cho;
    const fat_g = kcal_fat / kcalg_fat;

    let gir_mgkgmin = NaN, fat_gkg_h = NaN, fat_gkg_day_equiv = NaN;
    if (horas) {
    const cho_g_h = cho_g / horas;
    gir_mgkgmin = (cho_g_h * 1000) / (Math.max(1e-6, peso) * 60);

    const fat_g_h = fat_g / horas;
    fat_gkg_h = fat_g_h / Math.max(1e-6, peso);
    fat_gkg_day_equiv = (fat_g / Math.max(1e-6, peso)) * (24 / horas);
    }

    const npc_per_n = kcal_np / Math.max(1e-6, N_g);



    const getPctClass = (val, goodMin, goodMax) => {
        if (val >= goodMin && (goodMax == null || val <= goodMax)) return "text-success";
        if (goodMax != null && (val > goodMax * 1.5 || val < goodMin / 1.5)) return "text-error";
        return "text-warning";
    };

    let pct_aa_class = getPctClass(pct_aa, 4, null);
    let pct_cho_class = getPctClass(pct_cho, 8, 35);
    let pct_fat_class = getPctClass(pct_fat, 1.5, 5);

    const getRateClass = (val, max) => {
        if (Number.isNaN(val)) return "";
        return val <= max ? "text-success" : "text-error";
    };

    let gir_mgkgmin_class = getRateClass(gir_mgkgmin, gir_max);
    let fat_gkg_day_equiv_class = getRateClass(fat_gkg_day_equiv, lip_max_day);


    return {
        "imc": imc,
        "prot_g_total": prot_g,
        "nitrogen_g_total": N_g,
        "kcal_total": kcal_tot,
        "kcal_prot": kcal_prot,
        "kcal_np": kcal_np,
        "kcal_cho": kcal_cho,
        "kcal_npc": npc_per_n,
        "pct_aa": pct_aa,
        "pct_aa_class": pct_aa_class,
        "pct_cho": pct_cho,
        "pct_cho_class": pct_cho_class,
        "pct_fat": pct_fat,
        "pct_fat_class": pct_fat_class,
        "gir_mgkgmin": gir_mgkgmin,
        "gir_mgkgmin_class": gir_mgkgmin_class,
        "fat_gkg_h": fat_gkg_h,
        "fat_gkg_day_equiv": fat_gkg_day_equiv,
        "fat_gkg_day_equiv_class": fat_gkg_day_equiv_class
    }
}

export function compararFormulas(data, formulaciones) {
    
    const peso = data.weight;
    const kcal_kg = data.kcal_kg_desired;
    const prot_kg = data.prot_kg_desired;
    const kcalg_aa = data.kcal_aa;
    const kcalg_cho = data.kcal_cho;
    const kcalg_fat = data.kcal_lipids;
    const carb_npc_pct = Math.min(100, Math.max(0, data.carb_npc_pct));

    const prot_target = peso * prot_kg;
    const kcal_tot = peso * kcal_kg;
    const kcal_prot = prot_target * kcalg_aa;
    const kcal_np = Math.max(0, kcal_tot - kcal_prot);
    const kcal_cho = kcal_np * (carb_npc_pct / 100);
    const kcal_fat = kcal_np - kcal_cho;

    const cho_target = kcal_cho / kcalg_cho;
    const fat_target = kcal_fat / kcalg_fat;

    const basis = 'perbag';
    const umbral = data.umbral_sim;

    // ??????
    // const coverThresh = Math.max(0, Math.min(200, readNum("coverage_threshold", 100)));
    const coverThresh = 100;

    const fmt = (x, d = 2) => isFinite(x) ? Number(x).toFixed(d) : '–';
    const vol_ml = data.volume_total_ml;
    const info = `Objetivos: Prot ${fmt(prot_target)} g · HdC ${fmt(cho_target)} g · Líp ${fmt(fat_target)} g` + (vol_ml ? ` (vol objetivo ${fmt(vol_ml, 0)} ml)` : '');
 
    function similitud(target, value) { 
        if (!isFinite(target) || target <= 0) 
            return 0;
        
        const diff = Math.abs(value - target);
        return Math.max(0, 1 - (diff / target)) * 100;
    }

    const resultados = formulaciones.map(r => {
        const nombre = r.product_name;
        const prot100 = parseFloat((r.nitrogen_g * 6.25) / r.volume_ml * 100);
        const cho100 = parseFloat(r.glucose_g / r.volume_ml * 100);
        const lip100 = parseFloat(r.lipids_g / r.volume_ml * 100);

        const prot_bag = parseFloat(r.nitrogen_g * 6.25);
        const cho_bag = parseFloat(r.glucose_g)
        const lip_bag = parseFloat(r.lipids_g);


        if (basis === 'perbag') {
            const sp = similitud(prot_target, prot_bag);
            const sc = similitud(cho_target, cho_bag);
            const sf = similitud(fat_target, lip_bag);
            const media = (sp + sc + sf) / 3;
            const ratios = [];
            if (prot_target > 0) ratios.push((prot_bag / prot_target) * 100);
            if (cho_target > 0) ratios.push((cho_bag / cho_target) * 100);
            if (fat_target > 0) ratios.push((lip_bag / fat_target) * 100);
            const coveragePct = ratios.length ? Math.min(...ratios) : 0;
            const covered = coveragePct >= coverThresh;
            
            const id = r.id;
            return { 
                "id": id,
                "nombre": nombre,
                "prot100": prot100,
                "cho100": cho100,
                "lip100": lip100,
                "prot_bag": prot_bag,
                "cho_bag": cho_bag,
                "lip_bag": lip_bag,
                "sp": sp,
                "sc": sc,
                "sf": sf,
                "media": media,
                "coveragePct": coveragePct,
                "covered": covered
            };
        } 
        else {
            const kcal_prot_form = prot100 * kcalg_aa;
            const kcal_cho_form = cho100 * kcalg_cho;
            const kcal_fat_form = lip100 * kcalg_fat;
            const kcal_sum_form = Math.max(1e-6, kcal_prot_form + kcal_cho_form + kcal_fat_form);
            const pct_aa_form = 100 * (kcal_prot_form / kcal_sum_form);
            const pct_cho_form = 100 * (kcal_cho_form / kcal_sum_form);
            const pct_fat_form = 100 * (kcal_fat_form / kcal_sum_form);

            const target_pct_aa = (kcal_tot > 0) ? 100 * (kcal_prot / kcal_tot) : 0;
            const target_pct_cho = (kcal_tot > 0) ? 100 * (kcal_cho / kcal_tot) : 0;
            const target_pct_fat = (kcal_tot > 0) ? 100 * (kcal_fat / kcal_tot) : 0;

            const sp = similitud(target_pct_aa, pct_aa_form);
            const sc = similitud(target_pct_cho, pct_cho_form);
            const sf = similitud(target_pct_fat, pct_fat_form);
            const media = (sp + sc + sf) / 3;

            const id = r.id;
            return { 
                "id": id,
                "nombre": nombre,
                "prot100": prot100,
                "cho100": cho100,
                "lip100": lip100,
                "prot_bag": prot_bag,
                "cho_bag": cho_bag,
                "lip_bag": lip_bag,
                "pct_aa_form": pct_aa_form,
                "pct_cho_form": pct_cho_form,
                "pct_fat_form": pct_fat_form,
                "sp": sp,
                "sc": sc,
                "sf": sf,
                "media": media
            };
        }
    }).filter(x => isFinite(x.media)).sort((a, b) => b.media - a.media);

    const umbral_clamp = Math.max(0, Math.min(100, umbral));
    const recs = resultados.filter(x => x.media >= umbral_clamp);


    return {
        info,
        recs
    };
}