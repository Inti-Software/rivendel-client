export function safeNavigate(to, options = {}) {
  const { replace = false } = options;
  const target = to?.startsWith('http') ? to : `${window.location.origin}${to.startsWith('/') ? to : `/${to}`}`;

  const isJsdom = /jsdom/i.test(window.navigator?.userAgent ?? '');

  if (isJsdom) {
    if (replace) {
      window.history.replaceState({}, '', new URL(target).pathname || '/');
    } else {
      window.history.pushState({}, '', new URL(target).pathname || '/');
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    }
    return;
  }

  if (replace) {
    window.location.replace(target);
    return;
  }

  window.location.href = target;
}
