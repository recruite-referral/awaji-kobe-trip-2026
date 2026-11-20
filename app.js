const shortDescriptions = {
  smile: 'すきな色で、ぬりぬり♪', craft: '海辺で、もぐもぐタイム',
  hotel: '今夜のおやどは、ここだよ', yumebutai: '景色を探して、てくてく',
  nankin: 'おいしいを、分けっこ', kyoryuchi: '街角のすてきと、コーヒー',
  meriken: '海風と、思い出の1枚'
};
const spots = Object.fromEntries(Object.entries(guideContent).map(([key, s]) => [key, {
  name: s.title, sub: shortDescriptions[key], time: s.time, description: s.intro,
  note: s.memo, url: s.official || s.source, query: s.map
}]));
const book = document.getElementById('book');
const pages = [...book.children];
const dots = [...document.querySelectorAll('[data-page-target]')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const phoneLayout = matchMedia('(max-width: 767px), (max-height: 600px) and (pointer: coarse)');
let motionPage = null;
const motionSeen = new WeakSet();
const motionSelector = '.event,.guide-figure,.guide-intro,.guide-highlight,.guide-memo,.guide-links,.map-stop,.return-reservation,.food-card,.spot-link,.trip-memo,.source-note,.food-source-note,.page-footer';
const motionObserver = !reduced.matches && 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-revealed');
    motionObserver.unobserve(entry.target);
  });
}, {threshold: 0.06, rootMargin: '0px 0px -12px 0px'}) : null;
function enhanceTripMotion(scope = document) {
  if (!motionObserver) return;
  const targets = [...scope.querySelectorAll(motionSelector)];
  if (scope.matches?.(motionSelector)) targets.unshift(scope);
  targets.forEach((element,index) => {
    if (motionSeen.has(element)) return;
    motionSeen.add(element);
    element.classList.add('reveal-item');
    element.style.setProperty('--reveal-delay', Math.min((index % 5) * 45, 180) + 'ms');
    motionObserver.observe(element);
  });
}
function enterPageMotion() {
  const page = pages[active];
  if (motionPage === page) return;
  motionPage = page;
  pages.forEach(p => {p.classList.toggle('is-current', p === page); p.classList.remove('page-enter');});
  void page.offsetWidth;
  page.classList.add('page-enter');
}
let active = 0;
let navigationTarget = null;
let scrollFrame;
let settleTimer;
const gestureCue = document.getElementById('gesture-cue');
let lastHintPage = null;
let gestureCueTimer;
function showGestureCue() {
  const pageId = pages[active].id;
  if (pageId === lastHintPage) return;
  lastHintPage = pageId;
  gestureCue.classList.remove('is-visible');
  void gestureCue.offsetWidth;
  gestureCue.classList.add('is-visible');
  clearTimeout(gestureCueTimer);
  gestureCueTimer = setTimeout(() => gestureCue.classList.remove('is-visible'), 2800);
}

function syncHeight() {
  if (phoneLayout.matches) book.style.removeProperty('height');
  else book.style.height = (pages[active].offsetHeight + 22) + 'px';
}
function state(index) {
  active = Math.max(0, Math.min(pages.length - 1, index));
  syncHeight();
  const section = active >= pages.findIndex(p => p.id === 'links') ? 'links'
    : active >= pages.findIndex(p => p.id === 'day2') ? 'day2'
    : active >= 1 ? 'day1' : 'cover';
  dots.forEach(button => {
    if (button.dataset.pageTarget === section) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  refreshTripMap(pages[active].id);
  refreshFoodMap(pages[active].id);
}
function pageLeft(index) {
  return pages[index].offsetLeft - pages[0].offsetLeft;
}
function nearestPage() {
  const step = pages.length > 1 ? pageLeft(1) : book.clientWidth;
  return Math.max(0, Math.min(pages.length - 1, Math.round(book.scrollLeft / step)));
}
function finishScroll() {
  if (navigationTarget !== null && Math.abs(book.scrollLeft - pageLeft(navigationTarget)) > 2) return;
  navigationTarget = null;
  state(nearestPage());
  showGestureCue();
  enterPageMotion();
}
function go(index) {
  const target = Math.max(0, Math.min(pages.length - 1, index));
  if (target !== active && phoneLayout.matches) pages[target].scrollTop = 0;
  if (target !== active) gestureCue.classList.remove('is-visible');
  navigationTarget = target;
  state(target);
  book.scrollTo({left: pageLeft(target), behavior: reduced.matches ? 'instant' : 'smooth'});
  if (!phoneLayout.matches) {
    window.scrollTo({top: Math.max(0, book.getBoundingClientRect().top + window.scrollY - 12),
      behavior: reduced.matches ? 'instant' : 'smooth'});
  }
}
function goToId(id) {
  const index = pages.findIndex(page => page.id === id);
  if (index >= 0) go(index);
}
function openSpot(key) { goToId('spot-' + key); }

dots.forEach(button => button.addEventListener('click', () => goToId(button.dataset.pageTarget)));
book.addEventListener('scroll', () => {
  cancelAnimationFrame(scrollFrame);
  scrollFrame = requestAnimationFrame(() => {
    const index = nearestPage();
    if (navigationTarget === null && index !== active) {
      gestureCue.classList.remove('is-visible');
      state(index);
    }
  });
  clearTimeout(settleTimer);
  settleTimer = setTimeout(finishScroll, 150);
}, {passive: true});
book.addEventListener('scrollend', finishScroll);
for (const type of ['pointerdown', 'wheel']) {
  book.addEventListener(type, () => { navigationTarget = null; }, {passive: true});
}

let observedBookWidth = book.clientWidth;
new ResizeObserver(() => {
  const width = book.clientWidth;
  syncHeight();
  if (width === observedBookWidth) return;
  observedBookWidth = width;
  navigationTarget = null;
  book.scrollTo({left: pageLeft(active), behavior: 'instant'});
  refreshTripMap(pages[active].id);
  refreshFoodMap(pages[active].id);
}).observe(book);
phoneLayout.addEventListener('change', () => {
  syncHeight();
  book.scrollTo({left: pageLeft(active), behavior: 'instant'});
  refreshTripMap(pages[active].id);
  refreshFoodMap(pages[active].id);
});

document.querySelectorAll('[data-spot]').forEach(button => {
  button.addEventListener('click', () => openSpot(button.dataset.spot));
});
Object.entries(spots).forEach(([key, spot]) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'spot-link';
  const title = document.createElement('span');
  title.textContent = spot.name;
  const sub = document.createElement('small');
  sub.textContent = spot.sub;
  title.append(sub);
  const tag = document.createElement('span');
  tag.className = 'link-tag';
  tag.textContent = '紹介・地図';
  button.append(title, tag);
  button.addEventListener('click', () => openSpot(key));
  document.getElementById('spot-list').append(button);
});
document.querySelectorAll('[data-return-day]').forEach(button => {
  button.addEventListener('click', () => goToId('day' + button.dataset.returnDay));
});
document.querySelectorAll('[data-go-map]').forEach(button => {
  button.addEventListener('click', () => goToId(button.dataset.goMap));
});
document.querySelectorAll('[data-go-food]').forEach(button => {
  button.addEventListener('click', () => goToId(button.dataset.goFood));
});
document.querySelector('.brand').addEventListener('click', event => {
  event.preventDefault(); go(0);
});
document.fonts.ready.then(syncHeight);
document.querySelector('.cover-scene').addEventListener('load', syncHeight);
document.querySelectorAll('.guide-figure img').forEach(img => img.addEventListener('load', syncHeight));
pages.forEach(page => new ResizeObserver(() => {
  if (page === pages[active]) syncHeight();
}).observe(page));
if (motionObserver) {
  document.documentElement.classList.add('motion-enabled');
  enhanceTripMotion();
}
document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('motion-paused', document.hidden));
state(0);
requestAnimationFrame(() => { showGestureCue(); enterPageMotion(); });
