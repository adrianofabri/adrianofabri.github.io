/* Financeiro do Consultório · ponte GitHub ↔ Apps Script
 * Substitui google.script.run: as chamadas vão por fetch POST para a implantação "API GitHub com senha".
 * O acesso aos dados continua protegido pelo PIN de 4 dígitos do próprio app. */
(function () {
  var API = "https://script.google.com/macros/s/AKfycbygddoJAd8999ZiCOQsWjvPLWbfcLI9PCCHrNWSpUcQTe3D9XU_kqGxt5gc_I21vgmW/exec";
  function post(fn, args) {
    return fetch(API, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ fn: fn, args: args || [] }),
      redirect: "follow"
    }).then(function (r) {
      if (!r.ok) throw new Error("Falha de conexão (" + r.status + ").");
      return r.json();
    }, function () {
      throw new Error("Sem conexão com o servidor. Verifique a internet e tente de novo.");
    }).then(function (j) {
      if (j && j.ok) return j.data;
      throw new Error((j && j.erro) || "Erro no servidor.");
    });
  }
  function runner() {
    var ok = function () {}, er = function () {};
    var p = new Proxy({}, {
      get: function (_, nome) {
        if (nome === "withSuccessHandler") return function (f) { ok = f; return p; };
        if (nome === "withFailureHandler") return function (f) { er = f; return p; };
        if (nome === "withUserObject") return function () { return p; };
        return function () {
          var args = Array.prototype.slice.call(arguments);
          post(String(nome), args).then(function (d) { ok(d); }, function (e) { er(e); });
        };
      }
    });
    return p;
  }
  window.google = { script: { get run() { return runner(); } } };
})();
