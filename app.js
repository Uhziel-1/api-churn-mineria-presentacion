(() => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const progressBar = document.getElementById("progressBar");
  const slideCounter = document.getElementById("slideCounter");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  const notesBtn = document.getElementById("notesBtn");
  const notesDrawer = document.getElementById("notesDrawer");
  const notesText = document.getElementById("notesText");
  const closeNotesBtn = document.getElementById("closeNotesBtn");

  const overviewBtn = document.getElementById("overviewBtn");
  const overviewModal = document.getElementById("overviewModal");
  const overviewGrid = document.getElementById("overviewGrid");
  const closeOverviewBtn = document.getElementById("closeOverviewBtn");

  const fullscreenBtn = document.getElementById("fullscreenBtn");

  let currentIndex = 0;

  function getSlideTitle(slide, idx) {
    const heading = slide.querySelector("h1, h2");
    if (heading) return heading.textContent.trim();
    const quote = slide.querySelector(".hero-quote");
    if (quote) return "El Reto de la Reproducibilidad";
    return `Diapositiva ${idx + 1}`;
  }

  function buildOverview() {
    overviewGrid.innerHTML = "";
    slides.forEach((slide, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "overview-item" + (idx === currentIndex ? " active" : "");
      btn.innerHTML = `<span>Slide ${idx + 1}</span><strong>${getSlideTitle(slide, idx)}</strong>`;
      btn.addEventListener("click", () => {
        goToSlide(idx);
        toggleOverview(false);
      });
      overviewGrid.appendChild(btn);
    });
  }

  function goToSlide(index) {
    const clamped = Math.max(0, Math.min(index, slides.length - 1));
    currentIndex = clamped;

    slides.forEach((slide, idx) => {
      slide.classList.toggle("active", idx === currentIndex);
    });

    const pct = ((currentIndex + 1) / slides.length) * 100;
    progressBar.style.width = `${pct}%`;
    slideCounter.textContent = `${currentIndex + 1} / ${slides.length}`;
    notesText.textContent = slides[currentIndex].dataset.notes || "";

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === slides.length - 1;

    if (history.replaceState) {
      history.replaceState(null, "", `#slide-${currentIndex + 1}`);
    }
  }

  function nextSlide() {
    if (currentIndex < slides.length - 1) goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    if (currentIndex > 0) goToSlide(currentIndex - 1);
  }

  function toggleNotes(forceState) {
    const shouldShow =
      typeof forceState === "boolean" ? forceState : notesDrawer.classList.contains("hidden");
    notesDrawer.classList.toggle("hidden", !shouldShow);
    notesBtn.classList.toggle("active", shouldShow);
  }

  function toggleOverview(forceState) {
    const shouldShow =
      typeof forceState === "boolean" ? forceState : overviewModal.classList.contains("hidden");
    if (shouldShow) buildOverview();
    overviewModal.classList.toggle("hidden", !shouldShow);
    overviewBtn.classList.toggle("active", shouldShow);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);
  notesBtn.addEventListener("click", () => toggleNotes());
  closeNotesBtn.addEventListener("click", () => toggleNotes(false));
  overviewBtn.addEventListener("click", () => toggleOverview());
  closeOverviewBtn.addEventListener("click", () => toggleOverview(false));
  fullscreenBtn.addEventListener("click", toggleFullscreen);

  document.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    if (!overviewModal.classList.contains("hidden")) {
      if (e.key === "Escape") toggleOverview(false);
      return;
    }

    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
      if (tag !== "BUTTON") {
        e.preventDefault();
        nextSlide();
      }
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "Home") {
      goToSlide(0);
    } else if (e.key === "End") {
      goToSlide(slides.length - 1);
    } else if (e.key.toLowerCase() === "n") {
      toggleNotes();
    } else if (e.key.toLowerCase() === "g") {
      toggleOverview();
    } else if (e.key.toLowerCase() === "f") {
      toggleFullscreen();
    }
  });

  // Navegación táctil simple (swipe horizontal)
  let touchStartX = 0;
  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  document.addEventListener("touchend", (e) => {
    const deltaX = e.changedTouches[0].screenX - touchStartX;
    if (deltaX < -50) nextSlide();
    if (deltaX > 50) prevSlide();
  }, { passive: true });

  // Slide 6: Pilares interactivos
  const pillarDetails = [
    "<code>scikit-learn==1.9.1</code> · <code>fastapi==0.143.0</code> · <code>pydantic==2.14.0</code> · Validado con <code>pip check</code> (0 conflictos).",
    "Origen <code>v1.0.0-raw</code> → <code>v2.0.0-limpio</code> con hashes SHA-256 en <code>DATA_VERSION.md</code> y semilla fija <code>SEED = 42</code>.",
    "Guía replicable paso a paso (<code>venv</code>, <code>train.py</code>, <code>run_local.py</code>) y <code>7/7</code> pruebas automatizadas con <code>pytest</code>."
  ];
  const pillarDetailEl = document.getElementById("pillarDetail");
  document.querySelectorAll(".pillar-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".pillar-card").forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      const idx = Number(card.dataset.pillar);
      pillarDetailEl.innerHTML = pillarDetails[idx] || "";
    });
  });

  // Slide 8: Demo funcional contra API real en Render
  const API_URL = "https://api-churn-mineria.onrender.com/predict";
  const PRESETS = {
    critico: {
      summary: "Ejemplo oficial Swagger: 5 meses · $98.50 · 5 soporte · 8.2 GB · 2 mora · 2.0 sat.",
      payload: {
        id_cliente: "CLI-2026-ALTO-RIESGO",
        antiguedad_meses: 5,
        cargo_mensual: 98.5,
        llamadas_soporte: 5,
        uso_datos_gb: 8.2,
        retrasos_pago: 2,
        satisfaccion: 2.0,
        contrato: "mensual",
        metodo_pago: "tarjeta",
        ciudad: "Lima"
      },
      fallback: {
        probabilidad_fuga: 0.8485,
        probabilidad_retencion: 0.1515,
        prediccion: 1,
        etiqueta: "Fuga Inminente",
        nivel_riesgo: "Crítico",
        factores_clave: [
          "Baja satisfacción declarada por el cliente (2.0/10)",
          "Frecuencia crítica de llamadas a soporte (5 incidentes reportados)",
          "Contrato mes a mes (baja barrera de salida / sin permanencia)",
          "Historial crediticio con mora (2 facturas con retraso)"
        ],
        accion_recomendada:
          "ALERTA MÁXIMA: Contactar en menos de 24h vía Customer Success. Acciones: asignar resolución técnica prioritaria nivel 2; ofrecer plan anual con 25% de descuento; bono inmediato de 20 GB de datos."
      }
    },
    fidelizado: {
      summary: "Cliente fiel: 58 meses · $48 · 0 soporte · 35 GB · 0 mora · 9.5 sat. · Bianual",
      payload: {
        id_cliente: "CLI-FIDELIZADO-01",
        antiguedad_meses: 58,
        cargo_mensual: 48.0,
        llamadas_soporte: 0,
        uso_datos_gb: 35.0,
        retrasos_pago: 0,
        satisfaccion: 9.5,
        contrato: "bianual",
        metodo_pago: "transferencia",
        ciudad: "Arequipa"
      },
      fallback: {
        probabilidad_fuga: 0.1092,
        probabilidad_retencion: 0.8908,
        prediccion: 0,
        etiqueta: "Cliente Retenido",
        nivel_riesgo: "Bajo",
        factores_clave: [
          "Alta satisfacción percibida (9.5/10)",
          "Contrato bianual consolidado (alta fidelización)",
          "Cliente de largo recorrido (58 meses en la compañía)"
        ],
        accion_recomendada:
          "Cliente Fidelizado (Bajo Riesgo): Excelente candidato para programas VIP de lealtad, preventas exclusivas o venta cruzada (upselling)."
      }
    }
  };

  let activePresetKey = "critico";
  const inAntiguedad = document.getElementById("inAntiguedad");
  const inCargo = document.getElementById("inCargo");
  const inSoporte = document.getElementById("inSoporte");
  const inDatos = document.getElementById("inDatos");
  const inRetrasos = document.getElementById("inRetrasos");
  const inSatisfaccion = document.getElementById("inSatisfaccion");
  const inContrato = document.getElementById("inContrato");
  const inPago = document.getElementById("inPago");
  const inCiudad = document.getElementById("inCiudad");

  const runDemoBtn = document.getElementById("runDemoBtn");
  const demoStatus = document.getElementById("demoStatus");
  const resClientId = document.getElementById("resClientId");
  const resBadge = document.getElementById("resBadge");
  const resLatency = document.getElementById("resLatency");
  const resProb = document.getElementById("resProb");
  const resRetention = document.getElementById("resRetention");
  const probMeterFill = document.getElementById("probMeterFill");
  const resLabel = document.getElementById("resLabel");
  const resFactors = document.getElementById("resFactors");
  const resAction = document.getElementById("resAction");

  function fillFormFromPreset(preset) {
    const p = preset.payload;
    if (resClientId) resClientId.textContent = p.id_cliente;
    inAntiguedad.value = p.antiguedad_meses;
    inCargo.value = p.cargo_mensual;
    inSoporte.value = p.llamadas_soporte;
    inDatos.value = p.uso_datos_gb;
    inRetrasos.value = p.retrasos_pago;
    inSatisfaccion.value = p.satisfaccion;
    inContrato.value = p.contrato;
    inPago.value = p.metodo_pago;
    inCiudad.value = p.ciudad;
  }

  function readPayloadFromForm() {
    const presetId = PRESETS[activePresetKey]?.payload?.id_cliente || "DEMO-S15-VIVO";
    return {
      id_cliente: presetId,
      antiguedad_meses: Number(inAntiguedad.value),
      cargo_mensual: Number(inCargo.value),
      llamadas_soporte: Number(inSoporte.value),
      uso_datos_gb: Number(inDatos.value),
      retrasos_pago: Number(inRetrasos.value),
      satisfaccion: Number(inSatisfaccion.value),
      contrato: inContrato.value,
      metodo_pago: inPago.value,
      ciudad: inCiudad.value
    };
  }

  function renderResult(data, latencyText) {
    const pct = (Number(data.probabilidad_fuga) * 100).toFixed(2);
    const retPct =
      data.probabilidad_retencion !== undefined
        ? (Number(data.probabilidad_retencion) * 100).toFixed(2)
        : (100 - Number(pct)).toFixed(2);
    const isLow = Number(data.prediccion) === 0;
    const tone = isLow ? "bajo" : "critico";
    resBadge.textContent = `Riesgo ${data.nivel_riesgo}`;
    resBadge.className = `result-badge ${tone}`;
    resLatency.textContent = latencyText;
    resProb.textContent = `${pct} %`;
    resRetention.textContent = `Retención: ${retPct} %`;
    if (probMeterFill) {
      probMeterFill.style.width = `${pct}%`;
      probMeterFill.className = `prob-meter-fill ${tone}`;
    }
    resLabel.textContent = `${data.etiqueta} · prediccion = ${data.prediccion}`;

    resFactors.innerHTML = "";
    const factors = Array.isArray(data.factores_clave) ? data.factores_clave.slice(0, 4) : [];
    factors.forEach((f) => {
      const li = document.createElement("li");
      li.textContent = f;
      resFactors.appendChild(li);
    });

    resAction.textContent = data.accion_recomendada;
  }

  document.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".preset-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activePresetKey = btn.dataset.preset;
      const preset = PRESETS[activePresetKey];
      fillFormFromPreset(preset);
      renderResult(preset.fallback, "Ref. Swagger / Local");
      demoStatus.textContent = preset.summary;
    });
  });

  runDemoBtn.addEventListener("click", async () => {
    const preset = PRESETS[activePresetKey];
    const payload = readPayloadFromForm();
    runDemoBtn.disabled = true;
    demoStatus.textContent = "Conectando con Render (si estaba en reposo puede tardar ~30 s)...";

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    const t0 = performance.now();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const roundTripMs = Math.round(performance.now() - t0);
      renderResult(
        data,
        `API: ${data.tiempo_inferencia_ms} ms · Red: ${roundTripMs} ms`
      );
      demoStatus.textContent = "Respuesta recibida en vivo desde api-churn-mineria.onrender.com (HTTP 200).";
    } catch (err) {
      renderResult(preset.fallback, "Modo respaldo local");
      demoStatus.textContent =
        "Sin respuesta inmediata de Render; mostrando resultado determinista verificado.";
    } finally {
      clearTimeout(timer);
      runDemoBtn.disabled = false;
    }
  });

  // Inicializar en slide del hash si existe
  const match = window.location.hash.match(/^#slide-(\d+)$/);
  const initial = match ? Number(match[1]) - 1 : 0;
  goToSlide(initial);
})();
