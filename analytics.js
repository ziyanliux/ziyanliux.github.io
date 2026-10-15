(() => {
  // Count published page loads; local previews and section navigation are excluded.
  if (location.origin !== "https://ziyanliux.github.io") return;
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true) return;

  const callback = "HomepageTraffic_" + Math.random().toString(36).slice(2);
  const request = document.createElement("script");
  let timeout;
  const cleanup = () => {
    clearTimeout(timeout);
    request.remove();
    delete window[callback];
  };

  // Busuanzi's official client uses this JSONP endpoint for site PV and UV.
  // Record the visit without rendering counters on the page.
  window[callback] = cleanup;
  request.src = "https://busuanzi.ibruce.info/busuanzi?jsonpCallback=" + callback;
  request.async = true;
  request.referrerPolicy = "origin";
  request.onerror = cleanup;
  timeout = setTimeout(cleanup, 10000);
  document.head.append(request);
})();
