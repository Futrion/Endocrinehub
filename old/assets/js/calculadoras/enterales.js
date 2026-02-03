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
    if (units>0 && withinK && withinP) picks.push({item:it, units});;
  }

  // render
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