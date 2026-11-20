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
let active = 0;
let navigationTarget = null;
let scrollFrame;
let settleTimer;

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
  document.getElementById('page-count').textContent = `${active + 1} / ${pages.length}`;
  document.getElementById('prev').disabled = active === 0;
  document.getElementById('next').disabled = active === pages.length - 1;
  refreshTripMap(pages[active].id);
}
function pageLeft(index) {
  return pages[index].offsetLeft - pages[0].offsetLeft;
}
function nearestPage() {
  const step = pages.length > 1 ? pageLeft(1) : book.clientWidth;
  return Math.max(0, Math.min(pages.length - 1, Math.round(book.scrollLeft / step)));
}
function finishScroll() {
  navigationTarget = null;
  state(nearestPage());
}
function go(index) {
  const target = Math.max(0, Math.min(pages.length - 1, index));
  if (target !== active && phoneLayout.matches) pages[target].scrollTop = 0;
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
document.getElementById('prev').addEventListener('click', () => go(active - 1));
document.getElementById('next').addEventListener('click', () => go(active + 1));
book.addEventListener('scroll', () => {
  cancelAnimationFrame(scrollFrame);
  scrollFrame = requestAnimationFrame(() => {
    const index = nearestPage();
    if (navigationTarget === null && index !== active) state(index);
  });
  clearTimeout(settleTimer);
  settleTimer = setTimeout(finishScroll, 150);
}, {passive: true});
book.addEventListener('scrollend', finishScroll);

let observedBookWidth = book.clientWidth;
new ResizeObserver(() => {
  const width = book.clientWidth;
  syncHeight();
  if (width === observedBookWidth) return;
  observedBookWidth = width;
  navigationTarget = null;
  book.scrollTo({left: pageLeft(active), behavior: 'instant'});
  refreshTripMap(pages[active].id);
}).observe(book);
phoneLayout.addEventListener('change', () => {
  syncHeight();
  book.scrollTo({left: pageLeft(active), behavior: 'instant'});
  refreshTripMap(pages[active].id);
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
document.querySelector('.brand').addEventListener('click', event => {
  event.preventDefault(); go(0);
});
document.fonts.ready.then(syncHeight);
document.querySelector('.cover-scene').addEventListener('load', syncHeight);
document.querySelectorAll('.guide-figure img').forEach(img => img.addEventListener('load', syncHeight));
pages.forEach(page => new ResizeObserver(() => {
  if (page === pages[active]) syncHeight();
}).observe(page));
state(0);
