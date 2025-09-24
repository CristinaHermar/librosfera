// ========= Config =========
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR_lN4MQGP2PigjKJFOV8ZK92MvfpQWj8aH7qqntBJHOKv6XsvLAxriHmjU3WcD7kafNvNbj3pTFqND/pub?gid=0&single=true&output=csv';

// Fallback local (por si falla el CSV)
const FALLBACK_BOOKS = [
  { titulo:'La isla misteriosa', autor:'J. Verne', genero:'aventura, clásico', tono:'épico', ritmo:'rápido', publico:'general', etiquetas:'isla', flags:'Lenguaje antiguo', reseña:'Aventura clásica con ingenio y exploración.' },
  { titulo:'Orgullo y prejuicio', autor:'J. Austen', genero:'romance, clásico', tono:'ágil', ritmo:'medio', publico:'adulto', etiquetas:'regencia', flags:'Romance; referencias sociales', reseña:'Romance afilado con crítica social.' },
  { titulo:'El nombre de la rosa', autor:'U. Eco', genero:'misterio, histórica', tono:'oscuro', ritmo:'pausado', publico:'adulto', etiquetas:'monasterio', flags:'Violencia; tensión', reseña:'Misterio intelectual en la Edad Media.' },
  { titulo:'El Hobbit', autor:'J.R.R. Tolkien', genero:'fantasía, aventura', tono:'luminoso', ritmo:'medio', publico:'juvenil', etiquetas:'viaje', flags:'Violencia fantástica leve', reseña:'Viaje iniciático lleno de criaturas y tesoros.' },
  { titulo:'Ciencia ficción para curiosos', autor:'Varios', genero:'ciencia ficción', tono:'especulativo', ritmo:'medio', publico:'general', etiquetas:'ideas', flags:'Temas maduros', reseña:'Explora futuros posibles con buen pulso.' },
];

// ========= i18n =========
const i18n = {
  es: {
    brand: "Librosfera",
    taglineSummary: "Acerca de esta guía",
    taglineParagraph:
      `Recomendaciones para quienes buscan libros que atrapan, que dejan huella.
       Historias con personajes fuera de lo común o imposibles de olvidar.
       Aquí encontrarás lecturas que valen la pena.
       Además te señalamos las <strong>red flags</strong> que casi nadie menciona:
       lenguaje vulgar, referencias LGBT, relaciones tóxicas, violencia, tensión psicológica...
       pero que nos importa a los que buscamos buenas lecturas.`,

    chooseGenres: "Elige uno o más géneros",
    hint: "O pídele al destino que elija por ti.",
    destinyBtn: "✨ Que el destino lo decida",
    resetBtn: "↺ Limpiar selección",

    refineSearch: "Afina tu búsqueda",
    toneLabel: "Tono",
    paceLabel: "Ritmo",
    anyOption: "(cualquiera)",
    seeRecs: "✨ Ver recomendaciones",
    keepRefining: "Seguir afinando",
    subhint: "Las opciones se rellenan solitas según el/los géneros elegidos.",

    coffeeTitle: "☕ ¿Te sirvió?",
    coffeeText: "Invítame un café para poder seguir con este increíble proyecto ✨",
    coffeeBtn: "☕ Invítame un café",

    loadingGenres: "Cargando géneros…",
    loadingCatalog: "Cargando catálogo…",
    noGenresFound: "No encontré géneros.",
    noMatches: "No hay coincidencias con esos filtros 😢",
    pickOrDestiny: "Elige al menos un <strong>género</strong> o pulsa <strong> ✨Que el destino lo decida</strong>."
  },
  en: {
    brand: "Librosfera",
    taglineSummary: "About this guide",
    taglineParagraph:
      `Recommendations for readers who want books that hook you and stay with you.
       Stories with extraordinary or unforgettable characters.
       Here you'll find reads that are truly worth it.
       We also point out the <strong>red flags</strong> few mention:
       vulgar language, LGBT references, toxic relationships, violence, psychological tension...
       the things that matter to readers seeking great books.`,

    chooseGenres: "Choose one or more genres",
    hint: "Or let destiny decide for you.",
    destinyBtn: "✨ Let destiny decide",
    resetBtn: "↺ Clear selection",

    refineSearch: "Refine your search",
    toneLabel: "Tone",
    paceLabel: "Pace",
    anyOption: "(any)",
    seeRecs: "✨ See recommendations",
    keepRefining: "Keep refining",
    subhint: "Options auto-fill based on the genres you choose.",

    coffeeTitle: "☕ Did it help?",
    coffeeText: "Buy me a coffee to keep this amazing project alive ✨",
    coffeeBtn: "☕ Buy me a coffee",

    loadingGenres: "Loading genres…",
    loadingCatalog: "Loading catalog…",
    noGenresFound: "No genres found.",
    noMatches: "No matches with those filters 😢",
    pickOrDestiny: "Pick at least one <strong>genre</strong> or press <strong>✨ Let destiny decide</strong>."
  }
};

let currentLang = localStorage.getItem("lang") || "es";

// ========= Estado =========
let CATALOG = [];
let SELECTED_GENRES = new Set();
let SELECTED_TONE = "";
let SELECTED_PACE = "";
let HAS_TRIGGERED = false;

// NUEVO: control explícito para mostrar el Paso 2 solo tras “Seguir afinando”
let SHOW_ADVANCED = false;

// ========= Helpers =========
const $ = s => document.querySelector(s);

function splitGenres(g){ return String(g||'').split(',').map(s=>s.trim()).filter(Boolean); }
function unique(arr){ return Array.from(new Set(arr.filter(Boolean))).sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'})); }

function normalizeRow(r){
  // normaliza claves por si el CSV trae mayúsculas/minúsculas distintas
  const out={};
  const keys = ['titulo','autor','genero','tono','ritmo','publico','etiquetas','flags','reseña','resena'];
  keys.forEach(k=>{
    out[k.includes('reseñ')?'reseña':k] = (r[k] ?? r[k?.toUpperCase?.()] ?? r[k?.toLowerCase?.()] ?? '').toString().trim();
  });
  return out;
}

function renderStateMessage(where, key){
  where.innerHTML = `<div class="empty">${i18n[currentLang][key]}</div>`;
}

// ========= Géneros =========
function renderGenres(){
  const cont = $('#genresContainer');
  cont.innerHTML = "";
  const all = unique(CATALOG.flatMap(r => splitGenres(r.genero)));
  if(!all.length){
    renderStateMessage(cont, 'noGenresFound');
    return;
  }
  all.forEach(g=>{
    const b = document.createElement('button');
    b.textContent = g;
    b.className = SELECTED_GENRES.has(g) ? 'active' : '';
    b.onclick = () => {
      // alternar selección
      SELECTED_GENRES.has(g) ? SELECTED_GENRES.delete(g) : SELECTED_GENRES.add(g);

      // re-render géneros (para reflejar active)
      renderGenres();

      // actualizar opciones de tono/ritmo en base al filtro actual
      updateOpts();

      // 👇 Importante: NO mostrar resultados aún
      HAS_TRIGGERED = false;
      renderEmpty();

      // mantener la visibilidad del Paso 2 según SHOW_ADVANCED
      updateVisibility();

      // actualizar contador de coincidencias
      updateCtaCount();
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

  toneSel.innerHTML = `<option value="">${i18n[currentLang].anyOption}</option>` + tones.map(t=>`<option>${t}</option>`).join('');
  paceSel.innerHTML = `<option value="">${i18n[currentLang].anyOption}</option>` + paces.map(p=>`<option>${p}</option>`).join('');

  if(!SELECTED_TONE && tones.length===1){ SELECTED_TONE=tones[0]; toneSel.value=SELECTED_TONE; }
  if(!SELECTED_PACE && paces.length===1){ SELECTED_PACE=paces[0]; paceSel.value=SELECTED_PACE; }

  updateCtaCount();
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
  root.innerHTML = `<div class='empty'>${i18n[currentLang].pickOrDestiny}</div>`;
}

function renderResults(list){
  const root = $('#results'); 
  root.innerHTML = "";
  if(!list.length){
    renderStateMessage(root, 'noMatches');
    return;
  }
  list.slice(0,8).forEach(r=>{
    const d = document.createElement('div');
    d.className = 'book';
    d.innerHTML = `
      <h3>${r.titulo||'—'}</h3>
      <p><strong>${currentLang==='es'?'Autor':'Author'}:</strong> ${r.autor||'—'}</p>
      <p><strong>${currentLang==='es'?'Géneros':'Genres'}:</strong> ${r.genero||'—'}</p>
      <p><strong>${currentLang==='es'?'Tono':'Tone'}:</strong> ${r.tono||'—'}</p>
      <p><strong>${currentLang==='es'?'Ritmo':'Pace'}:</strong> ${r.ritmo||'—'}</p>
      <p><strong>${currentLang==='es'?'Público':'Audience'}:</strong> ${r.publico||'—'}</p>
      <p class="flags"><strong>${currentLang==='es'?'Flags':'Flags'}:</strong> ${r.flags || '—'}</p>
      <hr class="sep" />
      <p><strong>${currentLang==='es'?'Reseña':'Blurb'}:</strong> ${r['reseña'] || r['resena'] || '—'}</p>
    `;
    root.appendChild(d);
  });
  // scroll suave hacia resultados en móvil
  root.scrollIntoView({behavior:'smooth', block:'start'});
}

// ======== CTA Count ========
function updateCtaCount(){
  const n = applyFilters().length;
  const btn = $('#applyFiltersBtn');
  const counter = $('#recCount');
  if(btn){
    const baseTxt = (currentLang==='es' ? '✨ Ver recomendaciones' : '✨ See recommendations');
    btn.textContent = n ? `${baseTxt} (${n})` : baseTxt;
  }
  if(counter){
    if(currentLang==='es'){
      counter.textContent = n===0 ? '0 coincidencias (ajusta filtros)'
        : (n===1 ? '1 coincidencia posible' : `${n} coincidencias posibles`);
    }else{
      counter.textContent = n===0 ? '0 matches (tweak filters)'
        : (n===1 ? '1 possible match' : `${n} possible matches`);
    }
  }
}

// ========= Visibilidad =========
// ANTES: se mostraba Paso 2 al elegir géneros:contentReference[oaicite:1]{index=1}
// AHORA: solo si el usuario presionó "Seguir afinando"
function updateVisibility(){
  const adv = $('#advancedFilters');
  if(SHOW_ADVANCED){
    adv.classList.remove('hidden');
  }else{
    adv.classList.add('hidden');
    // al ocultar, limpiamos selects
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
  SHOW_ADVANCED=false;           // ocultar Paso 2 en reset
  renderGenres(); updateOpts(); renderEmpty();
  updateVisibility();
}

// ========= Traducción UI =========
function applyTranslations(lang){
  // Textos con data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.dataset.i18n;
    if(i18n[lang][key]) el.innerHTML = i18n[lang][key];
  });

  // Ajustar selects "(cualquiera)/(any)"
  const toneSel = $('#toneSelect');
  const paceSel = $('#paceSelect');
  if(toneSel && toneSel.options.length){
    toneSel.options[0].textContent = i18n[lang].anyOption;
  }
  if(paceSel && paceSel.options.length){
    paceSel.options[0].textContent = i18n[lang].anyOption;
  }

  // Botón del header
  const langBtn = document.getElementById("langToggle");
  if(langBtn) langBtn.textContent = (lang === "es") ? "🌐 EN" : "🌐 ES";

  currentLang = lang;
  localStorage.setItem("lang", lang);

  // Re-render de mensajes/labels en resultados (si ya hubo búsqueda)
  if(!HAS_TRIGGERED) renderEmpty();
  else renderResults(applyFilters());

  // Rematar contador en el idioma nuevo
  updateCtaCount();
}

// ========= Init =========
document.addEventListener('DOMContentLoaded', ()=>{
  // Mensajes iniciales
  renderStateMessage($('#genresContainer'), 'loadingGenres');
  renderStateMessage($('#results'), 'loadingCatalog');

  // Carga CSV
  Papa.parse(SHEET_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: res => {
      try{
        const rows = (res.data||[]).map(normalizeRow).filter(r => (r.titulo||'').trim() !== '');
        CATALOG = rows.length ? rows : FALLBACK_BOOKS;
      }catch(e){
        console.error('Error parseando CSV:', e);
        CATALOG = FALLBACK_BOOKS;
      }

      // Render inicial
      renderGenres();
      updateOpts();
      up
