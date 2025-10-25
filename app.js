// ========= Config =========
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR_lN4MQGP2PigjKJFOV8ZK92MvfpQWj8aH7qqntBJHOKv6XsvLAxriHmjU3WcD7kafNvNbj3pTFqND/pub?gid=0&single=true&output=csv';

// Fallback local (por si falla el CSV)
const FALLBACK_BOOKS = [
  { titulo:'La isla misteriosa', autor:'J. Verne', genero:'aventura, clásico', tono:'épico', ritmo:'rápido', publico:'general', etiquetas:'isla', flags:'', 'reseña':'Aventura clásica con ingenio y exploración.' },
  { titulo:'Orgullo y prejuicio', autor:'J. Austen', genero:'romance, clásico', tono:'ágil', ritmo:'medio', publico:'adulto', etiquetas:'regencia', flags:'', 'reseña':'Romance afilado con crítica social.' },
  { titulo:'El nombre de la rosa', autor:'U. Eco', genero:'misterio, histórica', tono:'oscuro', ritmo:'pausado', publico:'adulto', etiquetas:'monasterio', flags:'', 'reseña':'Misterio intelectual en la Edad Media.' },
  { titulo:'El Hobbit', autor:'J.R.R. Tolkien', genero:'fantasía, aventura', tono:'luminoso', ritmo:'medio', publico:'juvenil', etiquetas:'viaje', flags:'', 'reseña':'Viaje iniciático lleno de criaturas y tesoros.' },
  { titulo:'Ciencia ficción para curiosos', autor:'Varios', genero:'ciencia ficción', tono:'especulativo', ritmo:'medio', publico:'general', etiquetas:'ideas', flags:'', 'reseña':'Explora futuros posibles con buen pulso.' },
];

let CATALOG = [];
let SELECTED_GENRES = new Set();
let SELECTED_TONE = "";
let SELECTED_PACE = "";
let HAS_TRIGGERED = false;

// ========= Helpers =========
const $ = s => document.querySelector(s);

function splitGenres(g){ return String(g||'').split(',').map(s=>s.trim()).filter(Boolean); }
function unique(arr){ return Array.from(new Set(arr.filter(Boolean))).sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'})); }

function normalizeRow(r){
  // normaliza claves por si el CSV trae mayúsculas/minúsculas distintas
  const out={};
  const keys = ['titulo','autor','genero','tono','ritmo','publico','etiquetas','flags','reseña','resena'];
  keys.forEach(k=>{
    out[k.includes('reseñ')?'reseña':k] = (r[k] ?? r[k.toUpperCase?.()] ?? r[k.toLowerCase?.()] ?? '').toString().trim();
  });
  return out;
}

function renderStateMessage(where, msg){
  where.innerHTML = `<div class="empty">${msg}</div>`;
}

// ========= Géneros =========
function renderGenres(){
  const cont = $('#genresContainer');
  cont.innerHTML = "";
  const all = unique(CATALOG.flatMap(r => splitGenres(r.genero)));
  if(!all.length){
    renderStateMessage(cont, 'No encontré géneros.'); 
    return;
  }

  all.forEach(g=>{
    const b = document.createElement('button');
    b.textContent = g;
    b.className = SELECTED_GENRES.has(g) ? 'active' : '';
    b.onclick = () => {
      SELECTED_GENRES.has(g) ? SELECTED_GENRES.delete(g) : SELECTED_GENRES.add(g);
      updateVisibility();
      renderGenres();
      updateOpts();
      if (HAS_TRIGGERED) renderResults(applyFilters());
    };
    cont.appendChild(b);
  });
}

// ========= Filtros / resultados =========
function updateOpts(){
  const base = applyFilters();
  const tones = unique(base.map(r=>r.tono));
  const paces = unique(base.map(r=>r.ritmo));
  const toneSel = $('#toneSelect');
  const paceSel = $('#paceSelect');

  toneSel.innerHTML = '<option value="">(cualquiera)</option>' + tones.map(t=>`<option>${t}</option>`).join('');
  paceSel.innerHTML = '<option value="">(cualquiera)</option>' + paces.map(p=>`<option>${p}</option>`).join('');

  if(!SELECTED_TONE && tones.length===1){ SELECTED_TONE=tones[0]; toneSel.value=SELECTED_TONE; }
  if(!SELECTED_PACE && paces.length===1){ SELECTED_PACE=paces[0]; paceSel.value=SELECTED_PACE; }
}

function applyFilters(){
  let list = CATALOG;
  if(SELECTED_GENRES.size){
    list = list.filter(r=>{
      const gset = splitGenres(r.genero).map(x=>x.toLowerCase());
      return Array.from(SELECTED_GENRES).every(sel=>gset.includes(sel.toLowerCase()));
    });
  }
  if(SELECTED_TONE) list = list.filter(r=> (r.tono||'').toLowerCase() === SELECTED_TONE.toLowerCase());
  if(SELECTED_PACE) list = list.filter(r=> (r.ritmo||'').toLowerCase() === SELECTED_PACE.toLowerCase());
  return list;
}

function renderEmpty(){
  const root = $('#results');
  root.innerHTML = `<div class='empty'>Elige al menos un <strong>género</strong> o pulsa <strong>☕ Que el destino lo decida</strong>.</div>`;
}

function renderResults(list){
  const root = $('#results'); 
  root.innerHTML = "";
  if(!list.length){
    renderStateMessage(root, 'No hay coincidencias con esos filtros 😢');
    return;
  }
  list.slice(0,8).forEach(r=>{
    const d = document.createElement('div');
    d.className = 'book';
    d.innerHTML = `
      <h3>${r.titulo||'Sin título'}</h3>
      <p><strong>Autor:</strong> ${r.autor||'—'}</p>
      <p><strong>Géneros:</strong> ${r.genero||'—'}</p>
      <p><strong>Tono:</strong> ${r.tono||'—'}</p>
      <p><strong>Ritmo:</strong> ${r.ritmo||'—'}</p>
      <p><strong>Público:</strong> ${r.publico||'—'}</p>
      <hr class="sep" />
      <p><strong>Reseña:</strong> ${r['reseña'] || r['resena'] || '—'}</p>
    `;
    root.appendChild(d);
  });
  // scroll suave hacia resultados en móvil
  root.scrollIntoView({behavior:'smooth', block:'start'});
}

// ========= Visibilidad =========
function updateVisibility(){
  const adv = $('#advancedFilters');
  if(SELECTED_GENRES.size>0){
    adv.classList.remove('hidden');
  }else{
    adv.classList.add('hidden');
    SELECTED_TONE=""; SELECTED_PACE="";
    const tSel=$('#toneSelect'), pSel=$('#paceSelect');
    if(tSel) tSel.value=""; if(pSel) pSel.value="";
  }
}

// ========= Reset =========
function resetAll(){
  SELECTED_GENRES.clear();
  SELECTED_TONE=""; SELECTED_PACE="";
  HAS_TRIGGERED=false;
  renderGenres(); updateOpts(); renderEmpty();
  $('#advancedFilters').classList.add('hidden');
}

// ========= Init =========
document.addEventListener('DOMContentLoaded', ()=>{
  // Estado inicial visible
  renderStateMessage($('#genresContainer'), 'Cargando géneros…');
  renderStateMessage($('#results'), 'Cargando catálogo…');

  // Carga CSV
  Papa.parse(SHEET_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      try{
        const rows = (res.data||[]).map(normalizeRow).filter(r => (r.titulo||'').trim() !== '');
        if(rows.length){
          CATALOG = rows;
        }else{
          console.warn('CSV vacío, uso fallback.');
          CATALOG = FALLBACK_BOOKS;
        }
      }catch(e){
        console.error('Error parseando CSV:', e);
        CATALOG = FALLBACK_BOOKS;
      }

      // Render inicial
      renderGenres();
      updateOpts();
      updateVisibility();
      renderEmpty();

      // Listeners
      const toneSel=$('#toneSelect'), paceSel=$('#paceSelect');
      if(toneSel) toneSel.onchange=e=>{SELECTED_TONE=e.target.value||""; if(HAS_TRIGGERED) renderResults(applyFilters());};
      if(paceSel) paceSel.onchange=e=>{SELECTED_PACE=e.target.value||""; if(HAS_TRIGGERED) renderResults(applyFilters());};
      $('#applyFiltersBtn').onclick=()=>{HAS_TRIGGERED=true; renderResults(applyFilters());};

      // “Que el destino lo decida” — AHORA NO OCULTA GÉNEROS
      $('#destinyBtn').onclick=()=>{
        const pool = applyFilters();
        const base = (pool.length ? pool : (CATALOG.length ? CATALOG : FALLBACK_BOOKS));
        const pick = base[Math.floor(Math.random()*base.length)];
        HAS_TRIGGERED = true;
        renderResults([pick]);
        // mantenemos visible #genresContainer y filtros; solo mostramos el resultado
      };

      $('#resetBtn').onclick=resetAll;
    },
    error: err => {
      console.error('Error descargando CSV:', err);
      CATALOG = FALLBACK_BOOKS;
      renderGenres(); updateOpts(); updateVisibility(); renderEmpty();
    }
  });
});
