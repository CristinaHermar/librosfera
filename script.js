// 🌎 CONFIGURACIÓN DE IDIOMA Y URLs -------------------------
let currentLang = "es";
const urls = {
  es: "https://docs.google.com/spreadsheets/d/e/XXXX_ESPAÑOL/pub?gid=0&single=true&output=csv",
  en: "https://docs.google.com/spreadsheets/d/e/YYYY_INGLÉS/pub?gid=0&single=true&output=csv"
};

let libros = [];

// 🧱 FUNCIÓN DE ERROR --------------------------------------
function showError(msg) {
  console.error("⚠️ " + msg);
  const tbody = document.querySelector("#tablaLibros tbody");
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="3" style="color:red">${msg}</td></tr>`;
  }
}

// 📥 CARGAR DATOS DEL CSV ----------------------------------
function cargarDatos(url) {
  console.log("🔄 Cargando datos desde:", url);

  Papa.parse(url, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      console.log("✅ Datos recibidos:", results.data.slice(0, 5)); // muestra los primeros 5 registros

      if (!results.data || !results.data.length) {
        showError("No se encontraron datos.");
        return;
      }

      libros = results.data.map((row) => {
        const cleaned = {};
        for (let key in row) {
          cleaned[key.trim()] = (row[key] || "").trim();
        }
        return cleaned;
      });

      const tieneTitulo = libros.some(
        (l) => l["Título"] || l["Titulo"] || l["Title"]
      );

      if (!tieneTitulo) {
        showError("No se encontraron columnas de título válidas.");
        return;
      }

      libros.sort((a, b) => {
        const tituloA = a["Título"] || a["Titulo"] || a["Title"] || "";
        const tituloB = b["Título"] || b["Titulo"] || b["Title"] || "";
        return tituloA.localeCompare(tituloB, "es", { sensitivity: "base" });
      });

      mostrarTabla(libros);
      llenarSelectGeneros(libros);
    },
    error: function (err) {
      showError("Error al leer el archivo: " + err.message);
    },
  });
}

// 📊 MOSTRAR TABLA PRINCIPAL -------------------------------
function mostrarTabla(data) {
  const tbody = document.querySelector("#tablaLibros tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  data.forEach((libro) => {
    const titulo = libro["Título"] || libro["Titulo"] || libro["Title"] || "";
    const autor = libro["Autor"] || libro["Author"] || "";
    const genero = libro["Género"] || libro["Genero"] || libro["Genre"] || "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(titulo)}</td>
      <td>${escapeHtml(autor)}</td>
      <td>${escapeHtml(genero)}</td>
    `;
    tr.addEventListener("click", () => showDetalle(libro));
    tbody.appendChild(tr);
  });
}

// 🧩 LLENAR SELECT DE GÉNEROS -------------------------------
function llenarSelectGeneros(data) {
  const select = document.getElementById("generoSelect");
  if (!select) return;

  const generos = new Set();
  data.forEach((l) => {
    const g = l["Género"] || l["Genero"] || l["Genre"];
    if (g) g.split(",").forEach((v) => generos.add(v.trim()));
  });

  select.innerHTML = `<option value="">Todos los géneros</option>`;
  Array.from(generos)
    .sort()
    .forEach((g) => {
      const opt = document.createElement("option");
      opt.value = g;
      opt.textContent = g;
      select.appendChild(opt);
    });
}

// 💠 MOSTRAR TARJETAS ---------------------------------------
function mostrarTarjetas(data) {
  const cont = document.getElementById("tarjetasLibros");
  if (!cont) return;

  cont.innerHTML = "";
  data.forEach((l) => {
    const titulo = l["Título"] || l["Title"] || "";
    const autor = l["Autor"] || l["Author"] || "";
    const genero = l["Género"] || l["Genre"] || "";

    const div = document.createElement("div");
    div.className = "tarjeta";
    div.innerHTML = `
      <strong>${escapeHtml(titulo)}</strong><br>
      ${escapeHtml(autor)}<br>
      <em>${escapeHtml(genero)}</em>
    `;
    div.addEventListener("click", () => showDetalle(l));
    cont.appendChild(div);
  });
}

// 📖 DETALLE DEL LIBRO -------------------------------------
function showDetalle(libro) {
  const titulo = libro["Título"] || libro["Title"] || "";
  const autor = libro["Autor"] || libro["Author"] || "";
  const genero = libro["Género"] || libro["Genre"] || "";
  const reseña = libro["Reseña"] || libro["Review"] || "";

  alert(`📚 ${titulo}\n👤 ${autor}\n🏷️ ${genero}\n\n${reseña}`);
}

// 🔒 ESCAPAR HTML -------------------------------------------
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c])
  );
}

// 🎛️ EVENTOS ------------------------------------------------
document.getElementById("generoSelect").addEventListener("change", (e) => {
  const filtro = e.target.value;
  const filtrados = filtro
    ? libros.filter((l) =>
        (l["Género"] || l["Genero"] || l["Genre"] || "").includes(filtro)
      )
    : libros;
  mostrarTarjetas(filtrados);
});

document.getElementById("btnRandom").addEventListener("click", () => {
  if (!libros.length) return;
  const random = libros[Math.floor(Math.random() * libros.length)];
  const titulo = random["Título"] || random["Title"] || "";
  const autor = random["Autor"] || random["Author"] || "";
  const genero = random["Género"] || random["Genre"] || "";
  document.getElementById(
    "randomLibro"
  ).textContent = `${titulo} — ${autor} (${genero})`;
});

document.getElementById("btnIdioma").addEventListener("click", () => {
  currentLang = currentLang === "es" ? "en" : "es";
  const btn = document.getElementById("btnIdioma");
  btn.textContent = currentLang === "es" ? "English" : "Español";
  console.log("🌐 Cambiando a idioma:", currentLang);
  cargarDatos(urls[currentLang]);
});

// 🚀 INICIALIZACIÓN -----------------------------------------
cargarDatos(urls[currentLang]);
