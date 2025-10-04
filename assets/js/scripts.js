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

    // ====== CATÁLOGO + RECOMENDADOR ======
    const DEMO = [
      {name:"Novasource GI Protein", format:"500 ml", vol_ml:500, kcal:587, protein_g:30.5, carbs_g:66,  lipids_g:23, fiber_g:5,   fiber_type:"mixta",     tags:["general"]},
      {name:"Fresubin Protein Energy Drink", format:"200 ml", vol_ml:200, kcal:300, protein_g:20,  carbs_g:27,  lipids_g:13, fiber_g:0,   fiber_type:"sin",       tags:["general"]},
      {name:"Delical Effimax 2.0", format:"200 ml", vol_ml:200, kcal:400, protein_g:20,  carbs_g:42,  lipids_g:18, fiber_g:0,   fiber_type:"sin",       tags:["general"]},
      {name:"Meritene Clinical Extra Protein", format:"200 ml", vol_ml:200, kcal:420, protein_g:32,  carbs_g:33,  lipids_g:17, fiber_g:0,   fiber_type:"sin",       tags:["general","bariatrica"]},
      {name:"Resource Diabet Dense", format:"200 ml", vol_ml:200, kcal:360, protein_g:20,  carbs_g:42,  lipids_g:12, fiber_g:4,   fiber_type:"mixta",     tags:["diabetes"]},
      {name:"Fresubin 2kcal Crème", format:"125 g",  vol_ml:125, kcal:250, protein_g:12.5,carbs_g:17,  lipids_g:15, fiber_g:0,   fiber_type:"sin",       tags:["disfagia"]},
      {name:"ATÉMPERO", format:"200 ml",             vol_ml:200, kcal:302, protein_g:16.6,carbs_g:40,  lipids_g:9,  fiber_g:3,   fiber_type:"mixta",     tags:["diabetes"]},
      {name:"Fortimel DiabetCare Protein", format:"200 ml", vol_ml:200, kcal:300, protein_g:20,  carbs_g:35,  lipids_g:10, fiber_g:4,   fiber_type:"mixta",     tags:["diabetes"]},
      {name:"Glucerna Advance 1.6", format:"220 ml", vol_ml:220, kcal:355, protein_g:18.3,carbs_g:28,  lipids_g:14, fiber_g:3.5, fiber_type:"mixta",     tags:["diabetes"]},
      {name:"Fresubin Renal", format:"200 ml",       vol_ml:200, kcal:400, protein_g:6,   carbs_g:54,  lipids_g:16, fiber_g:0,   fiber_type:"sin",       tags:["renal"]},
      {name:"Nepro HP", format:"220 ml",             vol_ml:220, kcal:396, protein_g:17.82,carbs_g:31, lipids_g:18, fiber_g:3.3, fiber_type:"mixta",     tags:["renal"]},
      {name:"Nutricomp Hepa", format:"500 ml",       vol_ml:500, kcal:660, protein_g:20,  carbs_g:48,  lipids_g:35, fiber_g:8,   fiber_type:"mixta",     tags:["hepatico"]},
      {name:"Vegestart Complet", format:"200 ml",    vol_ml:200, kcal:204, protein_g:16.6,carbs_g:21,  lipids_g:7,  fiber_g:4,   fiber_type:"mixta",     tags:["general"]},
      {name:"Oxepa", format:"500 ml",                vol_ml:500, kcal:759, protein_g:31.25,carbs_g:0,  lipids_g:83, fiber_g:0,   fiber_type:"sin",       tags:["ventilacion"]}
    ];

    const LS_KEY = 'catalogo_suplementos_v2';
    let CATALOG = loadCatalog();

    // Mini-catálogo (dentro de "Ver catálogo")
    (function initCatalogTable(){
      document.getElementById('supp_count').textContent = CATALOG.length;
      const wrap = document.getElementById('supp_catalogo');
      const tbl = document.createElement('table');
      tbl.innerHTML = `
        <thead><tr>
          <th style="text-align:left">Producto</th><th>Formato</th>
          <th>kcal</th><th>Prot (g)</th><th>HC (g)</th><th>Líp (g)</th>
          <th>Fibra (g)</th><th>Tipo</th>
        </tr></thead><tbody></tbody>`;
      const tb = tbl.querySelector('tbody');
      CATALOG.forEach(s=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td style="text-align:left">${s.name}</td><td>${s.format}</td>
                        <td>${s.kcal}</td><td>${s.protein_g}</td><td>${s.carbs_g}</td><td>${s.lipids_g}</td>
                        <td>${s.fiber_g ?? 0}</td><td>${s.fiber_type || 'desconocida'}</td>`;
        tb.appendChild(tr);
      });
      wrap.appendChild(tbl);
      document.getElementById('supp_cat_status').textContent = `Catálogo cargado (${CATALOG.length} productos).`;
    })();

    // Catálogo editable
    function renderCatalog(){
      const wrap = document.getElementById('catalogoWrap');
      wrap.innerHTML = '';
      const tbl = document.createElement('table');
      tbl.innerHTML = `
        <thead>
          <tr>
            <th style="text-align:left">Producto</th><th>Formato</th>
            <th>kcal</th><th>Prot</th><th>HC</th><th>Líp</th>
            <th>Fibra (g)</th><th>Tipo fibra</th>
            <th>Tags</th><th>Acción</th>
          </tr>
        </thead><tbody></tbody>`;
      const tb = tbl.querySelector('tbody');
      CATALOG.forEach((s,idx)=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="text-align:left">${s.name}</td>
          <td>${s.format}</td>
          <td>${s.kcal}</td>
          <td>${s.protein_g}</td>
          <td>${s.carbs_g}</td>
          <td>${s.lipids_g}</td>
          <td>${s.fiber_g ?? 0}</td>
          <td>${s.fiber_type || 'desconocida'}</td>
          <td style="text-align:left">${(s.tags||[]).map(t=>`<span class="tag">${t}</span>`).join(' ')}</td>
          <td><button class="btn btn-danger" data-del="${idx}">🗑️</button></td>`;
        tb.appendChild(tr);
      });
      wrap.appendChild(tbl);
      wrap.querySelectorAll('button[data-del]').forEach(b=>{
        b.addEventListener('click', e=>{
          const i = +e.currentTarget.dataset.del;
          if (confirm('¿Eliminar este producto del catálogo?')){ CATALOG.splice(i,1); saveCatalog(); renderCatalog(); }
        });
      });
    }

    // Añadir producto
    document.getElementById('addBtn').addEventListener('click', ()=>{
  const s = {
    name: document.getElementById('p_name').value.trim(),
    format: document.getElementById('p_format').value.trim(),
    vol_ml: parseFloat(document.getElementById('p_vol').value),
    kcal: parseFloat(document.getElementById('p_kcal').value),
    protein_g: parseFloat(document.getElementById('p_prot').value),
    carbs_g: parseFloat(document.getElementById('p_hc').value),
    lipids_g: parseFloat(document.getElementById('p_lip').value),
    fiber_g: parseFloat(document.getElementById('p_fiber_g').value) || 0,
    fiber_type: document.getElementById('p_fiber_type').value || 'desconocida',
    tags: (document.getElementById('p_tags').value||'').split(',').map(t=>t.trim()).filter(Boolean)
  };
  if (!s.name || !s.format || !isFinite(s.vol_ml) || (!isFinite(s.kcal) && !isFinite(s.protein_g))) {
    alert('Completa al menos nombre, formato, volumen y kcal/proteína'); return;
  }
  CATALOG.push(s); saveCatalog(); renderCatalog(); refreshMiniCatalog();
  ['p_name','p_format','p_vol','p_kcal','p_prot','p_hc','p_lip','p_fiber_g','p_fiber_type','p_tags'].forEach(id=>{
    const el=document.getElementById(id); if(el.tagName==='SELECT') el.selectedIndex=0; else el.value='';
  });
});

    // Exportar / Importar / Reset
    document.getElementById('exportBtn').addEventListener('click', ()=>{
      const blob = new Blob([JSON.stringify(CATALOG,null,2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download='catalogo_suplementos.json'; a.click();
      URL.revokeObjectURL(url);
    });
    document.getElementById('importFile').addEventListener('change', (ev)=>{
      const f = ev.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = ()=>{
        try{
          const arr = JSON.parse(r.result);
          if (!Array.isArray(arr)) throw new Error('JSON debe ser un array');
          CATALOG = arr; saveCatalog(); renderCatalog(); refreshMiniCatalog();
          alert('Catálogo importado correctamente.');
        }catch(err){ alert('Error al importar: '+err.message); }
      };
      r.readAsText(f);
    });
    document.getElementById('resetBtn').addEventListener('click', ()=>{
      if (confirm('¿Restaurar catálogo demo? Se perderán cambios locales.')){
        CATALOG = DEMO.slice(); saveCatalog(); renderCatalog(); refreshMiniCatalog();
      }
    });
    function saveCatalog(){ localStorage.setItem(LS_KEY, JSON.stringify(CATALOG)); }
    function loadCatalog(){
      try{
        const raw = localStorage.getItem(LS_KEY);
        if (raw){ const arr = JSON.parse(raw); if (Array.isArray(arr)) return arr; }
      }catch(_){}
      return DEMO.slice();
    }
    function refreshMiniCatalog(){
      document.getElementById('supp_cat_status').textContent = `Catálogo cargado (${CATALOG.length} productos).`;
      document.getElementById('supp_count').textContent = CATALOG.length;
      const wrap = document.getElementById('supp_catalogo'); wrap.innerHTML='';
      const tbl = document.createElement('table');
      tbl.innerHTML = `
        <thead><tr>
          <th style="text-align:left">Producto</th><th>Formato</th>
          <th>kcal</th><th>Prot (g)</th><th>HC (g)</th><th>Líp (g)</th>
          <th>Fibra (g)</th><th>Tipo</th>
        </tr></thead><tbody></tbody>`;
      const tb = tbl.querySelector('tbody');
      CATALOG.forEach(s=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td style="text-align:left">${s.name}</td><td>${s.format}</td>
                        <td>${s.kcal}</td><td>${s.protein_g}</td><td>${s.carbs_g}</td><td>${s.lipids_g}</td>
                        <td>${s.fiber_g ?? 0}</td><td>${s.fiber_type || 'desconocida'}</td>`;
        tb.appendChild(tr);
      });
      wrap.appendChild(tbl);
    }
    renderCatalog();

    // ===== Recomendador (perfil + fibra) =====
    const fmt0 = x => isFinite(x)? Number(x).toFixed(0):'—';
    const fmt1 = x => isFinite(x)? Number(x).toFixed(1):'—';

    document.getElementById('supp_from_perkg').addEventListener('click', ()=>{
      const peso = parseFloat(document.getElementById('supp_peso').value)||0;
      const kcalkg = parseFloat(document.getElementById('supp_kcal_kg').value)||0;
      const prokg = parseFloat(document.getElementById('supp_prot_kg').value)||0;
      if (peso<=0 || (kcalkg<=0 && prokg<=0)) { alert('Introduce peso y al menos un objetivo por kg'); return; }
      if (kcalkg>0) document.getElementById('supp_kcal_total').value = Math.round(peso*kcalkg);
      if (prokg>0) document.getElementById('supp_prot_total').value = Math.round(peso*prokg);
    });

    document.getElementById('supp_calc').addEventListener('click', ()=>{
      const tgtKcal = parseFloat(document.getElementById('supp_kcal_total').value)||0;
      const tgtProt = parseFloat(document.getElementById('supp_prot_total').value)||0;
      const maxUnits = parseInt(document.getElementById('supp_max_units').value)||4;
      const perfil = document.getElementById('perfil').value;
      const perfilFibra = document.getElementById('perfilFibra').value;
      const soloCompatibles = document.getElementById('soloCompatibles').checked;

      if (tgtKcal<=0 && tgtProt<=0){ alert('Indica un objetivo (kcal o proteína)'); return; }

      // filtrar por perfil
      let pool = CATALOG.slice();
      if (soloCompatibles && perfil!=='general') pool = pool.filter(p => (p.tags||[]).includes(perfil));
      // filtrar por fibra
      pool = pool.filter(p => {
        const g = Number(p.fiber_g || 0);
        const t = (p.fiber_type || 'desconocida').toLowerCase();
        switch (perfilFibra) {
          case 'sin':  return g === 0 || t === 'sin';
          case 'con':  return g > 0 || (t !== 'sin' && t !== 'desconocida');
          case 'soluble':   return t === 'soluble';
          case 'insoluble': return t === 'insoluble';
          case 'mixta':     return t === 'mixta';
          case 'alta':      return g >= 5;
          default: return true;
        }
      });

      if (pool.length===0){ alert('No hay productos compatibles con el filtro seleccionado.'); return; }

      // ordenar por densidad proteica (g/100kcal), luego por kcal/envase
      const items = pool.map(s=>({...s, prot_per_100kcal: s.protein_g/(s.kcal/100)}))
                        .sort((a,b)=> (b.prot_per_100kcal - a.prot_per_100kcal) || (b.kcal - a.kcal));

      let remK = tgtKcal, remP = tgtProt;
      const picks = [];
      for (const it of items){
        let units = 0;
        while (units < maxUnits){
          const needK = tgtKcal>0 && remK>0;
          const needP = tgtProt>0 && remP>0;
          if (!needK && !needP) break;
          units++; remK -= it.kcal; remP -= it.protein_g;
        }
        if (units>0) picks.push({item:it, units});
        if ((tgtKcal>0 && remK<=0) && (tgtProt>0 && remP<=0)) break;
      }

      // render
      let sumUnits=0,sumK=0,sumP=0,sumHC=0,sumL=0;
      const tb = document.getElementById('supp_table'); tb.innerHTML='';
      if (picks.length===0){
        tb.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#666">No hay propuesta (ajusta objetivos o catálogo)</td></tr>`;
      }else{
        picks.forEach(p=>{
          const k = p.units*p.item.kcal, pr = p.units*p.item.protein_g, hc = p.units*p.item.carbs_g, li = p.units*p.item.lipids_g;
          sumUnits += p.units; sumK += k; sumP += pr; sumHC += hc; sumL += li;
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td style="text-align:left">${p.item.name} (${p.item.format})</td>
            <td>${p.units}</td>
            <td>${fmt0(k)}</td>
            <td>${fmt1(pr)}</td>
            <td>${fmt1(hc)}</td>
            <td>${fmt1(li)}</td>`;
          tb.appendChild(tr);
        });
      }
      document.getElementById('supp_sum_units').textContent = sumUnits;
      document.getElementById('supp_sum_kcal').textContent = fmt0(sumK);
      document.getElementById('supp_sum_prot').textContent = fmt1(sumP);
      document.getElementById('supp_sum_hc').textContent = fmt1(sumHC);
      document.getElementById('supp_sum_lip').textContent = fmt1(sumL);

      const defK = tgtKcal>0 ? Math.max(0, tgtKcal - sumK) : 0;
      const defP = tgtProt>0 ? Math.max(0, tgtProt - sumP) : 0;
      let msg = `Perfil: ${perfil} | Fibra: ${perfilFibra}. Objetivo: ${tgtKcal||'—'} kcal / ${tgtProt||'—'} g proteína. `+
                `Propuesto: ${fmt0(sumK)} kcal / ${fmt1(sumP)} g.`;
      if (defK>0 || defP>0) msg += ` Déficit → ${defK>0?fmt0(defK)+' kcal':''}${defK>0&&defP>0?' · ':''}${defP>0?fmt1(defP)+' g prot.':''}`;
      else msg += ' ✅ Objetivos cubiertos o superados.';
      document.getElementById('supp_deficit').textContent = msg;
      document.getElementById('supp_results').style.display = 'block';
    });

/*************** FÓRMULAS ENTERALES — con ml/h ***************/
const ENT_DEMO = [
  {name:"Fresubin Original",        format:"500 ml", vol_ml:500, kcal:500,  protein_g:19,    fiber_g:0,   fiber_type:"sin",   tags:["general"]},
  {name:"Fresubin Energy",          format:"500 ml", vol_ml:500, kcal:750,  protein_g:28,    fiber_g:0,   fiber_type:"sin",   tags:["general"]},
  {name:"Nutrison Protein Plus",    format:"500 ml", vol_ml:500, kcal:625,  protein_g:31.5,  fiber_g:0,   fiber_type:"sin",   tags:["general"]},
  {name:"Novasource GI Protein",    format:"500 ml", vol_ml:500, kcal:587,  protein_g:30.5,  fiber_g:5,   fiber_type:"mixta", tags:["general"]},
  {name:"Nutrison Advanced Diason", format:"500 ml", vol_ml:500, kcal:515,  protein_g:21.5,  fiber_g:0,   fiber_type:"desconocida", tags:["diabetes"]},
  {name:"Diaba Plus",               format:"500 ml", vol_ml:500, kcal:705,  protein_g:37,    fiber_g:0,   fiber_type:"desconocida", tags:["diabetes"]},
  {name:"Fresubin Renal",           format:"200 ml", vol_ml:200, kcal:400,  protein_g:6,     fiber_g:0,   fiber_type:"sin",   tags:["renal"]},
  {name:"Nepro HP",                 format:"220 ml", vol_ml:220, kcal:396,  protein_g:17.82, fiber_g:3.3, fiber_type:"mixta", tags:["renal"]},
  {name:"Nutricomp Hepa",           format:"500 ml", vol_ml:500, kcal:660,  protein_g:20,    fiber_g:8,   fiber_type:"mixta", tags:["hepatico"]},
  {name:"Oxepa",                    format:"500 ml", vol_ml:500, kcal:759,  protein_g:31.25, fiber_g:0,   fiber_type:"sin",   tags:["ventilacion"]},
  {name:"Peptamen 2.0 Enteral",     format:"500 ml", vol_ml:500, kcal:1000, protein_g:46,    fiber_g:0,   fiber_type:"sin",   tags:["oligomerica"]},
  {name:"Fresubin Intensive",       format:"500 ml", vol_ml:500, kcal:610,  protein_g:50,    fiber_g:0,   fiber_type:"sin",   tags:["oligomerica"]}
];

const ENT_LS_KEY = 'enteral_formulas_v1';
let ENT_CATALOG = loadEntCatalog();
const eFmt0 = x => isFinite(x)? Number(x).toFixed(0):'—';
const isAdminUI = ()=> document.body.classList.contains('admin');

function loadEntCatalog(){
  try{ const raw = localStorage.getItem(ENT_LS_KEY); if (raw){ const arr=JSON.parse(raw); if (Array.isArray(arr)) return arr; } }
  catch(_){}
  return ENT_DEMO.slice();
}
function saveEntCatalog(){ localStorage.setItem(ENT_LS_KEY, JSON.stringify(ENT_CATALOG)); }

/* Mini catálogo */
function refreshEntMini(){
  const status = document.getElementById('ent_cat_status');
  const count  = document.getElementById('ent_count');
  const wrap = document.getElementById('ent_catalogo'); wrap.innerHTML='';
  const tbl = document.createElement('table');
  tbl.innerHTML = `<thead><tr>
    <th style="text-align:left">Producto</th><th>Formato</th>
    <th>kcal</th><th>Prot (g)</th><th>Vol (ml)</th><th>Fibra</th><th>Tipo</th>
  </tr></thead><tbody></tbody>`;
  const tb = tbl.querySelector('tbody');
  ENT_CATALOG.forEach(s=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td style="text-align:left">${s.name}</td><td>${s.format||''}</td>
      <td>${s.kcal||0}</td><td>${s.protein_g||0}</td><td>${s.vol_ml||0}</td>
      <td>${s.fiber_g||0}</td><td>${s.fiber_type||'desconocida'}</td>`;
    tb.appendChild(tr);
  });
  wrap.appendChild(tbl);
  status.textContent = `Catálogo cargado (${ENT_CATALOG.length} productos).`;
  if (count) count.textContent = ENT_CATALOG.length;
}

/* Listado admin */
function renderEntAdmin(){
  const wrap = document.getElementById('ent_catalogo_admin'); if (!wrap) return;
  wrap.innerHTML = '';
  const tbl = document.createElement('table');
  const admin = isAdminUI();
  tbl.innerHTML = `<thead><tr>
    <th style="text-align:left">Producto</th><th>Formato</th><th>kcal</th><th>Prot</th>
    <th>Vol (ml)</th><th>Fibra</th><th>Tipo fibra</th><th>Tags</th>${admin?'<th>Acción</th>':''}
  </tr></thead><tbody></tbody>`;
  const tb = tbl.querySelector('tbody');
  ENT_CATALOG.forEach((s,i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:left">${s.name}</td><td>${s.format||''}</td>
      <td>${s.kcal||0}</td><td>${s.protein_g||0}</td><td>${s.vol_ml||0}</td>
      <td>${s.fiber_g||0}</td><td>${s.fiber_type||'desconocida'}</td>
      <td style="text-align:left">${(s.tags||[]).map(t=>`<span class="tag">${t}</span>`).join(' ')}</td>
      ${admin?`<td><button class="btn btn-danger" data-del="${i}">🗑️</button></td>`:''}`;
    tb.appendChild(tr);
  });
  wrap.appendChild(tbl);

  if (admin){
    wrap.querySelectorAll('button[data-del]').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const i = +e.currentTarget.dataset.del;
        if (confirm('¿Eliminar fórmula?')){
          ENT_CATALOG.splice(i,1); saveEntCatalog(); renderEntAdmin(); refreshEntMini();
        }
      });
    });
  }
}

/* Acciones admin */
document.getElementById('ent_add')?.addEventListener('click', ()=>{
  if (!isAdminUI()) return alert('Solo admin');
  const s = {
    name: ent_name.value.trim(),
    format: ent_format.value.trim(),
    vol_ml: +ent_vol.value || null,
    kcal: +ent_kcal.value || null,
    protein_g: +ent_prot.value || null,
    fiber_g: +ent_fiber_g.value || 0,
    fiber_type: ent_fiber_type.value || 'desconocida',
    tags: (ent_tags.value||'').split(',').map(t=>t.trim()).filter(Boolean)
  };
  if (!s.name) return alert('Falta nombre');
  ENT_CATALOG.push(s); saveEntCatalog(); renderEntAdmin(); refreshEntMini();
  ['ent_name','ent_format','ent_vol','ent_kcal','ent_prot','ent_fiber_g','ent_tags'].forEach(id=>document.getElementById(id).value='');
  ent_fiber_type.selectedIndex=0;
});
document.getElementById('ent_export')?.addEventListener('click', ()=>{
  if (!isAdminUI()) return alert('Solo admin');
  const blob = new Blob([JSON.stringify(ENT_CATALOG,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob); const a=document.createElement('a');
  a.href=url; a.download='enteral_formulas.json'; a.click(); URL.revokeObjectURL(url);
});
document.getElementById('ent_import')?.addEventListener('change', async (ev)=>{
  if (!isAdminUI()) { ev.target.value=''; return alert('Solo admin'); }
  const f = ev.target.files[0]; if (!f) return;
  try{
    const arr = JSON.parse(await f.text());
    if (!Array.isArray(arr)) throw new Error('El JSON debe ser un array');
    ENT_CATALOG = arr; saveEntCatalog(); renderEntAdmin(); refreshEntMini();
  }catch(e){ alert('Error importando: '+e.message); }
  finally { ev.target.value=''; }
});
document.getElementById('ent_reset')?.addEventListener('click', ()=>{
  if (!isAdminUI()) return alert('Solo admin');
  if (!confirm('¿Restaurar catálogo demo?')) return;
  ENT_CATALOG = ENT_DEMO.slice(); saveEntCatalog(); renderEntAdmin(); refreshEntMini();
});

/* Objetivos por kg → totales */
document.getElementById('ent_from_perkg').addEventListener('click', ()=>{
  const p = parseFloat(ent_peso.value)||0;
  const kcalkg = parseFloat(ent_kcalkg.value)||0;
  const prokg  = parseFloat(ent_prokg.value)||0;
  if (p<=0 || (kcalkg<=0 && prokg<=0)) return alert('Rellena peso y algún objetivo');
  if (kcalkg>0) ent_kcal_total.value = Math.round(p*kcalkg);
  if (prokg>0)  ent_prot_total.value = Math.round(p*prokg);
});

/* Propuesta + ml/h */
document.getElementById('ent_calc').addEventListener('click', ()=>{
  const tgtKcal = parseFloat(ent_kcal_total.value)||0;
  const tgtProt = parseFloat(ent_prot_total.value)||0;
  const maxUnits= parseInt(ent_max_units.value)||4;
  const horas   = parseFloat(ent_hours.value)||0;
  const perfil  = ent_perfil.value;
  const fsel    = ent_fibra.value;
  const solo    = ent_soloCompatibles.checked;

  if (tgtKcal<=0 && tgtProt<=0) return alert('Indica objetivo (kcal o proteína)');
  if (!(horas>0)) return alert('Indica horas de perfusión (>0)');

  // filtro por perfil
  let pool = ENT_CATALOG.slice();
  if (solo && perfil!=='general') pool = pool.filter(p => (p.tags||[]).includes(perfil));
  // filtro por fibra
  pool = pool.filter(p=>{
    const g = Number(p.fiber_g||0), t=(p.fiber_type||'desconocida').toLowerCase();
    switch (fsel){
      case 'sin': return g===0 || t==='sin';
      case 'con': return g>0 || (t!=='sin' && t!=='desconocida');
      case 'soluble': return t==='soluble';
      case 'insoluble': return t==='insoluble';
      case 'mixta': return t==='mixta';
      case 'alta': return g>=5;
      default: return true;
    }
  });
  if (!pool.length) return alert('No hay fórmulas con ese filtro');

  // ordenar por densidad proteica y kcal/ml
  const items = pool.map(s=>({ ...s,
    kcal_per_ml: (s.kcal||0)/(s.vol_ml||1),
    prot_per_100kcal: (s.protein_g||0)/((s.kcal||1)/100)
  })).sort((a,b)=> (b.prot_per_100kcal - a.prot_per_100kcal) || (b.kcal_per_ml - a.kcal_per_ml));

  let remK=tgtKcal, remP=tgtProt;
  const picks=[];
  for (const it of items){
    let u=0;
    while (u<maxUnits){
      const needK = tgtKcal>0 && remK>0;
      const needP = tgtProt>0 && remP>0;
      if (!needK && !needP) break;
      u++; remK-=it.kcal; remP-=it.protein_g;
    }
    if (u>0) picks.push({item:it, units:u});
    if ((tgtKcal>0 && remK<=0) && (tgtProt>0 && remP<=0)) break;
  }

  const tb = document.getElementById('ent_table'); tb.innerHTML='';
  let sumU=0,sumK=0,sumP=0,sumV=0;
  if (!picks.length){
    tb.innerHTML=`<tr><td colspan="5" style="text-align:center;color:#666">No hay propuesta</td></tr>`;
  }else{
    picks.forEach(p=>{
      const k=p.units*(p.item.kcal||0), pr=p.units*(p.item.protein_g||0), v=p.units*(p.item.vol_ml||0);
      sumU+=p.units; sumK+=k; sumP+=pr; sumV+=v;
      const tr=document.createElement('tr');
      tr.innerHTML=`<td style="text-align:left">${p.item.name} (${p.item.format})</td>
        <td>${p.units}</td><td>${eFmt0(k)}</td><td>${eFmt0(pr)}</td><td>${eFmt0(v)}</td>`;
      tb.appendChild(tr);
    });
  }
  ent_sum_units.textContent=sumU;
  ent_sum_kcal.textContent=eFmt0(sumK);
  ent_sum_prot.textContent=eFmt0(sumP);
  ent_sum_vol.textContent=eFmt0(sumV);

  // ml/h global según horas elegidas
  const rate = sumV>0 ? (sumV/horas) : 0;
  document.getElementById('ent_rate').textContent =
    `Perfusión: ${eFmt0(sumV)} ml en ${horas} h → ${rate.toFixed(1)} ml/h.`;

  const defK = tgtKcal>0? Math.max(0,tgtKcal-sumK):0;
  const defP = tgtProt>0? Math.max(0,tgtProt-sumP):0;
  let msg = `Perfil ${perfil} | Fibra ${fsel}. Objetivo: ${tgtKcal||'—'} kcal / ${tgtProt||'—'} g. `
          + `Propuesto: ${eFmt0(sumK)} kcal / ${eFmt0(sumP)} g.`;
  if (defK>0 || defP>0) msg += ` Déficit → ${defK?eFmt0(defK)+' kcal':''}${defK&&defP?' · ':''}${defP?eFmt0(defP)+' g prot.':''}`;
  else msg += ' ✅ Objetivos cubiertos o superados.';
  document.getElementById('ent_deficit').textContent=msg;
  document.getElementById('ent_results').style.display='block';
});

refreshEntMini();
renderEntAdmin();
/*************** /FÓRMULAS ENTERALES — con ml/h ***************/
document.querySelectorAll('#enteralModule .grid')
  .forEach(g => g.style.gridTemplateColumns = '1fr');