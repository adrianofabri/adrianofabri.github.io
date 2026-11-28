/* Botão "Início": volta para a Central de Aplicativos (adrianodomingues.app). */
(function () {
  try {
    if (window.top !== window.self) return;
    if (location.pathname === "/" || location.pathname === "/index.html") return;
    if (document.getElementById("central-inicio")) return;
    var s = document.createElement("style");
    s.textContent =
      "#central-inicio{position:fixed;left:50%;transform:translateX(-50%);top:env(safe-area-inset-top,0px);" +
      "z-index:2147483000;width:54px;height:22px;border-radius:0 0 12px 12px;display:flex;align-items:center;justify-content:center;" +
      "background:#AD863B;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.25);opacity:.8;text-decoration:none;-webkit-tap-highlight-color:transparent}" +
      "#central-inicio:hover,#central-inicio:focus-visible{opacity:1;height:26px}" +
      "#central-inicio svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}" +
      "@media print{#central-inicio{display:none!important}}";
    var a = document.createElement("a");
    a.id = "central-inicio";
    a.href = "/";
    a.title = "Início (Central de Aplicativos)";
    a.setAttribute("aria-label", "Voltar à Central de Aplicativos");
    a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-6h4v6"/></svg>';
    function add() { (document.head || document.documentElement).appendChild(s); (document.body || document.documentElement).appendChild(a); }
    if (document.body) add(); else document.addEventListener("DOMContentLoaded", add);
  } catch (e) {}
})();
