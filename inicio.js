/* Botão "Início": volta para a Central de Aplicativos (adrianodomingues.app). */
(function () {
  try {
    if (window.top !== window.self) return;
    if (location.pathname === "/" || location.pathname === "/index.html") return;
    if (document.getElementById("central-inicio")) return;
    var s = document.createElement("style");
    s.textContent =
      "#central-inicio{position:fixed;left:max(12px,env(safe-area-inset-left));top:max(10px,calc(env(safe-area-inset-top) + 6px));" +
      "z-index:2147483000;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;" +
      "background:#AD863B;color:#fff;box-shadow:0 2px 10px rgba(0,0,0,.28);opacity:.78;text-decoration:none;-webkit-tap-highlight-color:transparent}" +
      "#central-inicio:hover,#central-inicio:focus-visible{opacity:1}" +
      "#central-inicio svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}" +
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
