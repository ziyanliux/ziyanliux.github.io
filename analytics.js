(() => {
  // Count published page loads; local previews and section navigation are excluded.
  if (location.origin !== "https://ziyanliux.github.io") return;
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true) return;

  const stats = document.querySelector("[data-traffic-stats]");
  const views = document.querySelector("[data-traffic-views]");
  const visitors = document.querySelector("[data-traffic-visitors]");
  if (!stats || !views || !visitors) return;

  const callback = "HomepageTraffic_" + Math.random().toString(36).slice(2);
  const request = document.createElement("script");
  let timeout;
  const cleanup = () => {
    clearTimeout(timeout);
    request.remove();
    delete window[callback];
  };

  // Busuanzi's official client uses this JSONP endpoint for site PV and UV.
  window[callback] = (data) => {
    if (data && Number.isSafeInteger(data.site_pv) && data.site_pv >= 0 &&
        Number.isSafeInteger(data.site_uv) && data.site_uv >= 0) {
      views.textContent = data.site_pv.toLocaleString("en-US");
      visitors.textContent = data.site_uv.toLocaleString("en-US");
      stats.hidden = false;
    }
    cleanup();
  };
  request.src = "https://busuanzi.ibruce.info/busuanzi?jsonpCallback=" + callback;
  request.async = true;
  request.referrerPolicy = "origin";
  request.onerror = cleanup;
  timeout = setTimeout(cleanup, 10000);
  document.head.append(request);
})();
