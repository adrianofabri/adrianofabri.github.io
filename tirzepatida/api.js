/* Protocolo Tirzepatida 2.0 · ponte GitHub ↔ Apps Script (acesso por senha) */
(function () {
  var API = "https://script.google.com/macros/s/AKfycbysUZN2sU9KgTOyk_g169aA72iSSqm6balCCKX4Ne28vzFWlhUyjXqUH4yc6Wv7qecf/exec";
  var CHAVE = "tz2_k";
  var senha = "";
  try { senha = localStorage.getItem(CHAVE) || sessionStorage.getItem(CHAVE) || ""; } catch (e) {}
  var esperando = [];
  var tela = null;

  function guardar(s, lembrar) {
    senha = s;
    try {
      localStorage.removeItem(CHAVE); sessionStorage.removeItem(CHAVE);
      (lembrar ? localStorage : sessionStorage).setItem(CHAVE, s);
    } catch (e) {}
  }
  function esquecer() {
    senha = "";
    try { localStorage.removeItem(CHAVE); sessionStorage.removeItem(CHAVE); } catch (e) {}
  }

  function post(fn, args, k) {
    return fetch(API, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ fn: fn, args: args || [], k: k }),
      redirect: "follow"
    }).then(function (r) {
      if (!r.ok) throw new Error("Falha de conexão (" + r.status + ").");
      return r.json();
    }, function () {
      throw new Error("Sem conexão com o servidor. Verifique a internet e tente de novo.");
    });
  }

  function pedirSenha(msg) {
    return new Promise(function (ok) {
      esperando.push(ok);
      mostrarTela(msg);
    });
  }

  function chamar(fn, args) {
    var tentar = function () {
      if (!senha) return pedirSenha().then(tentar);
      return post(fn, args, senha).then(function (j) {
        if (j.ok) return j.data;
        if (j.erro === "SENHA_INVALIDA") { esquecer(); return pedirSenha("Senha incorreta. Tente de novo.").then(tentar); }
        throw new Error(j.erro || "Erro no servidor.");
      });
    };
    return tentar();
  }

  /* ---------- tela de acesso ---------- */
  function css() {
    if (document.getElementById("tz-acesso-css")) return;
    var s = document.createElement("style");
    s.id = "tz-acesso-css";
    s.textContent =
      "#tz-acesso{position:fixed;inset:0;z-index:99999;background:#f6f3ee;display:flex;align-items:center;justify-content:center;padding:20px;font-family:'Instrument Sans',system-ui,sans-serif;color:#221d16}" +
      "#tz-acesso[hidden]{display:none!important}" +
      "#tz-acesso .cx{width:100%;max-width:380px;background:#fff;border:1px solid #e6dfd3;border-radius:16px;padding:28px 24px;box-shadow:0 10px 40px rgba(60,40,10,.08);text-align:center}" +
      "#tz-acesso img{width:150px;max-width:60%;height:auto;margin:0 auto 10px;display:block}" +
      "#tz-acesso h1{font-family:'Marcellus',Georgia,serif;font-weight:400;font-size:1.45rem;margin:4px 0 2px;color:#221d16}" +
      "#tz-acesso p.s{margin:0 0 18px;color:#6f675b;font-size:.9rem}" +
      "#tz-acesso input[type=password]{width:100%;height:auto;font:500 1.05rem 'Instrument Sans',system-ui,sans-serif;padding:12px;border:1px solid #e6dfd3;border-radius:10px;text-align:center;letter-spacing:.15em;color:#221d16;background:#fff;box-sizing:border-box}" +
      "#tz-acesso input[type=password]:focus{outline:2px solid #8a6624;outline-offset:1px}" +
      "#tz-acesso label{display:flex;gap:8px;align-items:center;justify-content:center;margin:12px 0 16px;font-size:.88rem;color:#6f675b;cursor:pointer;text-transform:none;letter-spacing:0;font-weight:500}" +
      "#tz-acesso label input{width:auto;height:auto}" +
      "#tz-acesso button{width:100%;border:0;background:#8a6624;color:#fff;font:600 1rem 'Instrument Sans',system-ui,sans-serif;padding:12px;border-radius:10px;cursor:pointer}" +
      "#tz-acesso button:disabled{opacity:.6;cursor:wait}" +
      "#tz-acesso .m{min-height:1.3em;margin:12px 0 0;font-size:.88rem;color:#b3261e}";
    document.head.appendChild(s);
  }
  function mostrarTela(msg) {
    if (!document.body) { document.addEventListener("DOMContentLoaded", function () { mostrarTela(msg); }); return; }
    css();
    if (!tela) {
      var logo = document.querySelector("#logo-top,.logoBox img");
      tela = document.createElement("div");
      tela.id = "tz-acesso";
      tela.innerHTML =
        '<form class="cx" autocomplete="off">' +
        (logo ? '<img alt="" src="' + logo.getAttribute("src") + '">' : "") +
        "<h1>Protocolo Tirzepatida 2.0</h1><p class=\"s\">Acesso restrito ao consultório</p>" +
        '<input type="password" inputmode="numeric" placeholder="Senha" aria-label="Senha" required>' +
        '<label><input type="checkbox" checked> Lembrar neste aparelho</label>' +
        '<button type="submit">Entrar</button><p class="m" role="alert"></p></form>';
      document.body.appendChild(tela);
      var f = tela.querySelector("form"), inp = tela.querySelector("input[type=password]"),
          lem = tela.querySelector("input[type=checkbox]"), btn = tela.querySelector("button"), m = tela.querySelector(".m");
      f.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var s = inp.value.trim(); if (!s) return;
        btn.disabled = true; btn.textContent = "Entrando…"; m.textContent = "";
        post("entrar", [], s).then(function (j) {
          btn.disabled = false; btn.textContent = "Entrar";
          if (j.ok) {
            guardar(s, lem.checked); inp.value = ""; tela.hidden = true;
            var l = esperando; esperando = []; l.forEach(function (fn) { fn(); });
          } else {
            m.textContent = j.erro === "SENHA_INVALIDA" ? "Senha incorreta." : (j.erro || "Não foi possível entrar.");
            inp.select();
          }
        }, function (e) { btn.disabled = false; btn.textContent = "Entrar"; m.textContent = e.message; });
      });
    }
    tela.hidden = false;
    tela.querySelector(".m").textContent = msg || "";
    setTimeout(function () { var i = tela.querySelector("input[type=password]"); if (i) i.focus(); }, 50);
  }

  /* ---------- compatibilidade com o código do Apps Script (google.script.run) ---------- */
  function runner() {
    var ok = function () {}, er = function () {};
    var p = new Proxy({}, {
      get: function (_, nome) {
        if (nome === "withSuccessHandler") return function (f) { ok = f; return p; };
        if (nome === "withFailureHandler") return function (f) { er = f; return p; };
        if (nome === "withUserObject") return function () { return p; };
        return function () {
          var args = Array.prototype.slice.call(arguments);
          chamar(String(nome), args).then(function (d) { ok(d); }, function (e) { er(e); });
        };
      }
    });
    return p;
  }
  window.google = {
    script: {
      get run() { return runner(); },
      url: {
        getLocation: function (cb) {
          var par = {};
          new URLSearchParams(location.search).forEach(function (v, k) { par[k] = v; });
          cb({ parameter: par, hash: location.hash.slice(1) });
        }
      }
    }
  };

  /* ---------- botão Sair ---------- */
  function sair() { esquecer(); location.reload(); }
  window.TZ = { sair: sair, chamar: chamar };
  function botaoSair() {
    if (document.getElementById("tz-sair")) return;
    var b = document.createElement("button");
    b.type = "button"; b.id = "tz-sair"; b.textContent = "Sair"; b.title = "Sair e esquecer a senha neste aparelho";
    b.addEventListener("click", sair);
    var tema = document.getElementById("tema"), nav = document.querySelector(".app-nav");
    if (tema) { b.className = "btn ghost small"; tema.insertAdjacentElement("afterend", b); }
    else if (nav) { b.className = "secondary tema-btn"; nav.appendChild(b); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", botaoSair); else setTimeout(botaoSair, 0);
  window.addEventListener("load", botaoSair);
})();
