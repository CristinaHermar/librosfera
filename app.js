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
  if(SELECTED_GEN_
