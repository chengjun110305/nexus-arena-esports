/*
 * STORAGE DEMONSTRATION FOR UCCD2323
 * This file intentionally keeps the three storage technologies together so
 * the group can explain and demonstrate each one during the presentation.
 */
(function (window, $) {
  "use strict";

  const COOKIE_NAME = "nexus_cookie_consent";
  const FAVOURITES_KEY = "nexus_favourites";

  // COOKIES: stores only the visitor's cookie-consent decision for 180 days.
  function setConsentCookie(value) {
    const maxAge = 60 * 60 * 24 * 180;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
  }

  function getCookie(name) {
    const prefix = `${name}=`;
    const match = document.cookie.split(";").map(item => item.trim()).find(item => item.startsWith(prefix));
    return match ? decodeURIComponent(match.substring(prefix.length)) : null;
  }

  function initCookieConsent() {
    if (getCookie(COOKIE_NAME)) return;
    const banner = $(
      `<aside class="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
        <div class="d-md-flex align-items-center gap-3">
          <div class="flex-grow-1">
            <strong class="d-block mb-1">Your privacy, your choice</strong>
            <span class="text-muted-custom small">We use one essential cookie to remember this consent choice. Favourites and recent views use browser storage.</span>
          </div>
          <div class="d-flex gap-2 mt-3 mt-md-0">
            <button class="btn btn-sm btn-outline-light" data-cookie-choice="declined">Essential only</button>
            <button class="btn btn-sm btn-primary" data-cookie-choice="accepted">Accept</button>
          </div>
        </div>
      </aside>`
    );
    $("body").append(banner);
    banner.find("[data-cookie-choice]").on("click", function () {
      setConsentCookie($(this).data("cookie-choice"));
      banner.fadeOut(220, function () { banner.remove(); });
    });
  }

  // LOCALSTORAGE: favourites survive browser restarts until the user removes them.
  function readFavourites() {
    try { return JSON.parse(localStorage.getItem(FAVOURITES_KEY)) || []; }
    catch (error) { return []; }
  }

  function writeFavourites(items) {
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(items));
    $(document).trigger("nexus:favourites-updated", [items]);
  }

  function favouriteId(button) {
    return `${button.data("favorite-type")}:${button.data("favorite-id")}`;
  }

  function refreshFavouriteButtons() {
    const favourites = readFavourites();
    $(".favorite-btn").each(function () {
      const button = $(this);
      const selected = favourites.includes(favouriteId(button));
      button.toggleClass("is-favourite", selected)
        .attr("aria-pressed", String(selected))
        .attr("title", selected ? "Remove from favourites" : "Add to favourites");
      button.find("i").attr("class", selected ? "bi bi-star-fill" : "bi bi-star");
    });
  }

  function initFavourites() {
    refreshFavouriteButtons();
    $(document).on("click", ".favorite-btn", function () {
      const id = favouriteId($(this));
      const favourites = readFavourites();
      const index = favourites.indexOf(id);
      if (index >= 0) favourites.splice(index, 1); else favourites.push(id);
      writeFavourites(favourites);
      refreshFavouriteButtons();
    });
  }

  // SESSIONSTORAGE: these values last only for the current browser-tab session.
  function rememberTournamentFilter(filter) {
    sessionStorage.setItem("nexus_tournament_filter", filter);
  }
  function getTournamentFilter() {
    return sessionStorage.getItem("nexus_tournament_filter") || "all";
  }
  function rememberViewedPlayer(playerName) {
    sessionStorage.setItem("nexus_recent_player", playerName);
  }
  function getViewedPlayer() {
    return sessionStorage.getItem("nexus_recent_player");
  }

  window.NexusStorage = {
    initCookieConsent,
    initFavourites,
    readFavourites,
    rememberTournamentFilter,
    getTournamentFilter,
    rememberViewedPlayer,
    getViewedPlayer
  };
})(window, jQuery);
