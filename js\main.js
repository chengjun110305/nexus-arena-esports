(function ($) {
  "use strict";

  const pages = [
    ["Home", "index.html"], ["About", "about.html"], ["Tournaments", "tournaments.html"],
    ["Schedule", "schedule.html"], ["Teams", "teams.html"], ["Rankings", "rankings.html"],
    ["Players", "players.html"], ["Join us", "contact.html"]
  ];

  function currentFile() {
    return window.location.pathname.split("/").pop() || "index.html";
  }

  function buildHeader() {
    const active = currentFile();
    const links = pages.map(function (page) {
      const isActive = page[1] === active;
      return `<li class="nav-item"><a class="nav-link${isActive ? " active" : ""}" ${isActive ? 'aria-current="page"' : ""} href="${page[1]}">${page[0]}</a></li>`;
    }).join("");
    $("#siteHeader").html(
      `<nav class="navbar navbar-expand-lg navbar-dark fixed-top site-nav" aria-label="Main navigation">
        <div class="container">
          <a class="navbar-brand" href="index.html" aria-label="Nexus Arena home"><span class="brand-mark">NA</span><span>Nexus Arena</span></a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
          <div class="collapse navbar-collapse" id="mainNav"><ul class="navbar-nav ms-auto align-items-lg-center">${links}<li class="nav-item ms-lg-2"><span class="favourite-count" data-favourite-count title="Saved favourites">0</span></li></ul></div>
        </div>
      </nav>`
    );
  }

  function buildFooter() {
    $("#siteFooter").html(
      `<footer class="site-footer">
        <div class="container">
          <div class="row g-4">
            <div class="col-lg-5"><a class="navbar-brand mb-3" href="index.html"><span class="brand-mark">NA</span><span>Nexus Arena</span></a><p class="text-muted-custom pe-lg-5">A student-run university esports community where casual players, competitors and creators level up together.</p></div>
            <div class="col-6 col-lg-2"><div class="footer-title mb-3">Explore</div><ul class="footer-links"><li><a href="tournaments.html">Tournaments</a></li><li><a href="schedule.html">Schedule</a></li><li><a href="teams.html">Teams</a></li><li><a href="rankings.html">Rankings</a></li></ul></div>
            <div class="col-6 col-lg-2"><div class="footer-title mb-3">Club</div><ul class="footer-links"><li><a href="about.html">About us</a></li><li><a href="players.html">Players</a></li><li><a href="contact.html">Membership</a></li><li><a href="contact.html#faq">FAQ</a></li></ul></div>
            <div class="col-lg-3"><div class="footer-title mb-3">Club room</div><p class="text-muted-custom mb-1">Student Pavilion, Level 2</p><p class="text-muted-custom">Fridays · 7:30–10:30 PM</p><div class="social-links justify-content-start"><a href="https://discord.com/" target="_blank" rel="noopener" aria-label="Discord"><i class="bi bi-discord"></i></a><a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram"><i class="bi bi-instagram"></i></a><a href="https://www.youtube.com/" target="_blank" rel="noopener" aria-label="YouTube"><i class="bi bi-youtube"></i></a></div></div>
          </div>
          <div class="footer-bottom d-flex flex-column flex-md-row justify-content-between gap-2"><span>© <span data-current-year></span> Nexus Arena E-Sports Club. Student assignment prototype.</span><span>Built with HTML5 · CSS3 · Bootstrap · JavaScript · jQuery</span></div>
        </div>
      </footer>`
    );
  }

  function updateFavouriteCount(items) {
    const count = (items || NexusStorage.readFavourites()).length;
    $("[data-favourite-count]").text(count).attr("aria-label", `${count} saved favourites`);
  }

  function initReveal() {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      $(".reveal").addClass("is-visible"); return;
    }
    $("body").addClass("reveal-ready");
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { $(entry.target).addClass("is-visible"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    $(".reveal").each(function () { observer.observe(this); });
  }

  function initTournamentFilters() {
    if (!$("[data-tournament-grid]").length) return;
    function applyFilter(filter) {
      $(".filter-btn").removeClass("active").attr("aria-pressed", "false");
      $(`.filter-btn[data-filter="${filter}"]`).addClass("active").attr("aria-pressed", "true");
      $("[data-game]").each(function () {
        const show = filter === "all" || $(this).data("game") === filter;
        $(this).stop(true, true)[show ? "fadeIn" : "fadeOut"](220);
      });
      NexusStorage.rememberTournamentFilter(filter);
    }
    applyFilter(NexusStorage.getTournamentFilter());
    $(".filter-btn").on("click", function () { applyFilter($(this).data("filter")); });
  }

  function initPlayerViews() {
    const recent = NexusStorage.getViewedPlayer();
    if (recent) $("[data-recent-player]").removeClass("d-none").find("strong").text(recent);
    $(".player-card").on("click keydown", function (event) {
      if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const card = $(this);
      const name = card.data("player-name");
      NexusStorage.rememberViewedPlayer(name);
      $("#playerModalLabel").text(`${name} · ${card.data("handle")}`);
      $("#playerModalRole").text(`${card.data("game")} · ${card.data("role")}`);
      $("#playerModalBio").text(card.data("bio"));
      $("#playerModalStat").text(card.data("stat"));
      bootstrap.Modal.getOrCreateInstance(document.getElementById("playerModal")).show();
    });
  }

  function initContactForm() {
    const form = document.getElementById("joinForm");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) { event.stopPropagation(); form.classList.add("was-validated"); return; }
      const firstName = $("#firstName").val().trim();
      sessionStorage.setItem("nexus_join_interest", $("#mainGame").val());
      $("#formToast .toast-body").text(`Thanks, ${firstName}! This demo saved your game interest for this session. A real deployment would send the form to the club committee.`);
      bootstrap.Toast.getOrCreateInstance(document.getElementById("formToast")).show();
      form.reset(); form.classList.remove("was-validated");
    });
  }

  $(function () {
    buildHeader(); buildFooter();
    $("[data-current-year]").text(new Date().getFullYear());
    NexusStorage.initCookieConsent();
    NexusStorage.initFavourites();
    updateFavouriteCount();
    $(document).on("nexus:favourites-updated", function (_, items) { updateFavouriteCount(items); });
    initReveal(); initTournamentFilters(); initPlayerViews(); initContactForm();
    $(document).on("click", ".navbar-collapse .nav-link", function () {
      const nav = document.getElementById("mainNav");
      if (nav && nav.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(nav).hide();
    });
  });
})(jQuery);
