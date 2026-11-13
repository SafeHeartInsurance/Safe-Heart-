/* Safe Heart app.
   You should not need to edit this file.
   Change form links in config.json and shows in shows.json. */
(function () {
  "use strict";

  var DEFAULT_CONFIG = {
    claimFormUrl: "https://form.jotform.com/251616991657065",
    showSignupFormUrl: "",
    storyFormUrl: ""
  };

  // A link counts as "connected" only if it is a real https:// address.
  function isReady(url) {
    return typeof url === "string" && /^https:\/\/[^\s]+\.[^\s]+/.test(url.trim());
  }

  function getJSON(path) {
    // no-store so your edits on GitHub show up right away
    return fetch(path, { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error(path + " returned " + r.status);
      return r.json();
    });
  }

  function setLink(el, url, pendingText) {
    if (!el) return;
    var old = el.parentNode.querySelector('.pending-note[data-for="' + el.id + '"]');
    if (old) old.remove();
    if (isReady(url)) {
      el.href = url.trim();
      el.classList.remove("is-pending");
      el.removeAttribute("aria-disabled");
      el.onclick = null;
    } else {
      el.removeAttribute("href");
      el.classList.add("is-pending");
      el.setAttribute("aria-disabled", "true");
      el.onclick = function (e) { e.preventDefault(); };
      var note = document.createElement("span");
      note.className = "pending-note";
      note.setAttribute("data-for", el.id);
      note.textContent = pendingText;
      el.insertAdjacentElement("afterend", note);
    }
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function parseDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || "").trim());
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3]);
  }

  function prettyDate(d) {
    try {
      return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    } catch (e) { return d.toDateString(); }
  }

  var preview = /[?&]preview\b/.test(location.search);

  function renderShows(data, config) {
    var list = document.getElementById("showList");
    list.innerHTML = "";
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var shows = (data && Array.isArray(data.shows) ? data.shows : [])
      .filter(function (s) { return s && (preview || !s.draft); })
      .map(function (s) { return { s: s, d: parseDate(s.date) }; })
      .filter(function (x) { return !x.d || x.d >= today; })        // past shows hide themselves
      .sort(function (a, b) { return (a.d || 0) - (b.d || 0); });

    if (!shows.length) {
      var empty = el("div", "empty");
      empty.appendChild(el("p", null, "No shows are announced right now. Check back soon."));
      empty.lastChild.style.margin = "0";
      list.appendChild(empty);
      return;
    }

    shows.forEach(function (x, i) {
      var s = x.s;
      var card = el("article", "show");
      if (s.draft) card.appendChild(el("span", "tag", "Draft: only visible in preview"));
      card.appendChild(el("h3", null, s.name || "Safe Heart Show"));
      var ul = el("ul", "show-meta");
      [["Date", x.d ? prettyDate(x.d) : (s.date || "")], ["Time", s.time], ["Location", s.location]]
        .forEach(function (row) {
          if (!row[1]) return;
          var li = el("li");
          li.appendChild(el("b", null, row[0]));
          li.appendChild(document.createTextNode(" " + row[1]));
          ul.appendChild(li);
        });
      card.appendChild(ul);
      if (s.notes) card.appendChild(el("p", "show-notes", s.notes));

      var rsvp = isReady(s.rsvpUrl) ? s.rsvpUrl : config.showSignupFormUrl;
      var a = el("a", "btn btn-black", "RSVP for this show");
      a.id = "rsvp-" + i;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      card.appendChild(a);
      list.appendChild(card);
      setLink(a, rsvp, "RSVP link coming soon.");
    });
  }

  function start(config) {
    setLink(document.getElementById("claimBtn"), config.claimFormUrl, "Claim form link coming soon.");
    var note = document.getElementById("claimNote");
    if (note && !isReady(config.claimFormUrl)) note.hidden = true;
    setLink(document.getElementById("storyBtn"), config.storyFormUrl, "The story form isn't open yet. Check back soon.");

    getJSON("shows.json")
      .then(function (data) { renderShows(data, config); })
      .catch(function () {
        var list = document.getElementById("showList");
        list.innerHTML = "";
        var p = el("div", "empty");
        p.appendChild(el("p", null, "Show details couldn't load. Please try again in a moment."));
        p.lastChild.style.margin = "0";
        list.appendChild(p);
      });
  }

  getJSON("config.json")
    .then(function (c) {
      var merged = {};
      for (var k in DEFAULT_CONFIG) merged[k] = (c && c[k] != null) ? c[k] : DEFAULT_CONFIG[k];
      start(merged);
    })
    .catch(function () { start(DEFAULT_CONFIG); });

  document.getElementById("year").textContent = new Date().getFullYear();

  // Android "Install app" button
  var deferred = null;
  var installBtn = document.getElementById("installBtn");
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
    installBtn.hidden = false;
  });
  installBtn.addEventListener("click", function () {
    if (!deferred) return;
    deferred.prompt();
    deferred.userChoice.finally(function () { deferred = null; installBtn.hidden = true; });
  });
  window.addEventListener("appinstalled", function () { installBtn.hidden = true; });

  // Offline support
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
})();
