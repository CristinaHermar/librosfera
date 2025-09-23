const SHEET_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vR_lN4MQGP2PigjKJFOV8ZK92MvfpQWj8aH7qqntBJHOKv6XsvLAxriHmjU3WcD7kafNvNbj3pTFqND/pub?gid=0&single=true&output=csv';
let CATALOG=[],SELECTED_GENRES=new Set(),SELECTED_TONE="",SELECTED_PACE="",HAS_TRIGGERED=false;
const $=s=>document.querySelector(s);
function splitGenres(g){return String(g).split(',').map(s=>s.trim()).filter(Boolean)}
function unique(arr){return Array.from(new Set(arr.filter(Boolean))).sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'}))}
function normalizeRow(r){const out={};for(const k of ['titulo','autor','genero','tono','ritmo','publico','etiquetas','flags','reseña'])out[k]=(r[k]||r[k?.toLowerCase?.()]||"").toString().trim();return out}
function applyFilters(){let list=CATALOG;if(SELECTED_GENRES.size)list=list.filter(r=>{const gset=splitGenres(r.genero).map(x=>x.toLowerCase());return Array.from(SELECTED_GENRES).every(sel=>gset.includes(sel.toLowerCase()))});if(SELECTED_TONE)list=list.filter(r=>r.tono.toLowerCase()===SELECTED_TONE.toLowerCase());if(SELECTED_PACE)list=list.filter(r=>r.ritmo.toLowerCase()===SELECTED_PACE.toLowerCase());return list}
function renderGenres(){const cont=$('#genresContainer');cont.innerHTML="";unique(CATALOG.flatMap(r=>splitGenres(r.genero))).forEach(g=>{const b=document.createElement('button');b.textContent=g;b.className=SELECTED_GENRES.has(g)?'active':'';b.onclick=()=>{SELECTED_GENRES.has(g)?SELECTED_GENRES.delete(g):SELECTED_GENRES.add(g);renderGenres();updateOpts();if(HAS_TRIGGERED) renderResults(applyFilters());};cont.appendChild(b)})}
function updateOpts(){const base=applyFilters();const tones=unique(base.map(r=>r.tono)),paces=unique(base.map(r=>r.ritmo));const toneSel=$('#toneSelect'),paceSel=$('#paceSelect');toneSel.innerHTML='<option value="">(cualquiera)</option>'+tones.map(t=>`<option>${t}</option>`).join('');paceSel.innerHTML='<option value="">(cualquiera)</option>'+paces.map(p=>`<option>${p}</option>`).join('');if(!SELECTED_TONE&&tones.length===1){SELECTED_TONE=tones[0];toneSel.value=SELECTED_TONE}if(!SELECTED_PACE&&paces.length===1){SELECTED_PACE=paces[0];paceSel.value=SELECTED_PACE}}
function renderEmpty(){const root=$('#results');root.innerHTML=`<div class='empty'>Elige algunos filtros o pulsa <strong>✨ Descubrir lecturas</strong> para ver sugerencias.</div>`}
function renderResults(list){const root=$('#results');root.innerHTML="";if(!list.length){root.innerHTML='<div class="empty">No hay coincidencias con esos filtros 😢</div>';return}list.slice(0,8).forEach(r=>{const d=document.createElement('div');d.className='book';d.innerHTML=`<h3>${r.titulo}</h3><p><strong>Autor:</strong> ${r.autor||'—'}</p><p><strong>Géneros:</strong> ${r.genero||'—'}</p><p><strong>Tono:</strong> ${r.tono||'—'}</p><p><strong>Ritmo:</strong> ${r.ritmo||'—'}</p><p><strong>Público:</strong> ${r.publico||'—'}</p><hr class='sep' /><p><strong>Reseña:</strong> ${r['reseña']||'—'}</p>`;root.appendChild(d)})}
function resetAll(){SELECTED_GENRES.clear();SELECTED_TONE="";SELECTED_PACE="";HAS_TRIGGERED=false;renderGenres();updateOpts();renderEmpty()}
document.addEventListener('DOMContentLoaded',()=>{
  // Tabs
  document.querySelectorAll('.tab-btn').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p=>p.hidden=p.id!==b.dataset.tab);
  });
  // CSV
  Papa.parse(SHEET_URL,{download:true,header:true,skipEmptyLines:true,complete:res=>{
    CATALOG=res.data.map(normalizeRow);
    renderGenres(); updateOpts(); renderEmpty(); // <- NO mostramos resultados aún
    // events
    $('#toneSelect').onchange=e=>{SELECTED_TONE=e.target.value||""; if(HAS_TRIGGERED) renderResults(applyFilters())};
    $('#paceSelect').onchange=e=>{SELECTED_PACE=e.target.value||""; if(HAS_TRIGGERED) renderResults(applyFilters())};
    $('#applyFiltersBtn').onclick=()=>{HAS_TRIGGERED=true; renderResults(applyFilters())};
    $('#randomBtn').onclick=()=>{
      const pool=applyFilters(); if(!pool.length){renderResults([]); return;}
      const pick=pool[Math.floor(Math.random()*pool.length)];
      HAS_TRIGGERED=true; renderResults([pick]);
    };
    $('#resetBtn').onclick=resetAll;
  },error:err=>{const root=$('#results');root.innerHTML='<div class="empty">No pude leer el CSV.</div>';console.error(err);}});
});