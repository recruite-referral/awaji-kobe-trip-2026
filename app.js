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
let pageTurn = null;
let swipePointer = null;
let queuedPage = null;
let suppressClickUntil = 0;
let wheelTotal = 0;
let lastWheelAt = 0;
let wheelLockedUntil = 0;
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
  // Keep the gesture's original target alive until the turning sheet settles.
  // Safari may cancel a touch when its ancestor becomes inert mid-gesture.
  pages.forEach((page, i) => {
    page.inert = i !== active && !(pageTurn && i === pageTurn.from);
  });
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
function placePage(index, reset = true) {
  const target = Math.max(0, Math.min(pages.length - 1, index));
  if (reset && target !== active && phoneLayout.matches) pages[target].scrollTop = 0;
  state(target);
  book.scrollTo({left: pageLeft(target), behavior: 'instant'});
}

// A temporary, inert copy of the visible paper turns above the real next page.
// The real pages keep their native vertical scroll areas, including long guides.
function makePaperCopy(page, width, offsetY, scrollTop) {
  const copy = page.cloneNode(true);
  copy.removeAttribute('id');
  copy.removeAttribute('aria-label');
  copy.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
  copy.classList.remove('is-current', 'page-enter');
  copy.classList.add('page-turn-copy');
  copy.inert = true;
  copy.setAttribute('aria-hidden', 'true');
  copy.style.setProperty('width', width + 'px', 'important');
  copy.style.setProperty('height', page.clientHeight + 'px', 'important');
  copy.style.top = offsetY + 'px';
  // Embedded map frames cannot be copied as a rendered bitmap. Keep their space
  // on the turning paper; the real, interactive map stays on the live page.
  copy.querySelectorAll('iframe').forEach(frame => {
    const placeholder = document.createElement('div');
    placeholder.className = 'page-turn-map-preview';
    frame.replaceWith(placeholder);
  });
  return {copy, scrollTop};
}
function startPageTurn(target) {
  if (pageTurn || target === active || target < 0 || target >= pages.length) return false;
  const from = active;
  const backward = target < from;
  const originalTop = pages[from].scrollTop;
  const rect = book.getBoundingClientRect();
  const top = Math.max(0, rect.top);
  const height = Math.min(innerHeight, rect.bottom) - top;
  if (height <= 0) return false;
  const paperPage = backward ? pages[target] : pages[from];
  const offsetY = paperPage.getBoundingClientRect().top - top;
  const paper = makePaperCopy(paperPage, rect.width, offsetY, backward ? 0 : originalTop);
  const stage = document.createElement('div');
  stage.className = 'page-turn-stage';
  stage.setAttribute('aria-hidden', 'true');
  stage.inert = true;
  Object.assign(stage.style, {left: rect.left + 'px', top: top + 'px', width: rect.width + 'px', height: height + 'px'});
  stage.innerHTML = '<div class="page-turn-shadow"></div><div class="page-turn-sheet"><div class="page-turn-front"></div><div class="page-turn-back"><span>ふたり旅のしおり</span></div><div class="page-turn-light"></div></div>';
  stage.querySelector('.page-turn-front').append(paper.copy);
  document.body.append(stage);
  paper.copy.scrollTop = paper.scrollTop;
  pageTurn = {from, target, backward, originalTop, progress: 0, stage,
    sheet: stage.querySelector('.page-turn-sheet'), shadow: stage.querySelector('.page-turn-shadow'),
    light: stage.querySelector('.page-turn-light'), animation: null, settling: false};
  book.classList.add('is-turning');
  book.dataset.turnState = 'dragging';
  book.setAttribute('aria-busy', 'true');
  gestureCue.classList.remove('is-visible');
  clearTimeout(gestureCueTimer);
  // Forward: uncover the next page. Backward: lay the previous sheet on top.
  if (!backward) placePage(target);
  updatePageTurn(0);
  return true;
}
function paperTransform(turn, progress) {
  const angle = turn.backward ? -150 * (1 - progress) : -150 * progress;
  return `rotateY(${angle}deg)`;
}
function updatePageTurn(progress) {
  if (!pageTurn) return;
  pageTurn.progress = Math.max(0, Math.min(1, progress));
  pageTurn.sheet.style.transform = paperTransform(pageTurn, pageTurn.progress);
  const shade = Math.sin(pageTurn.progress * Math.PI);
  pageTurn.shadow.style.opacity = (shade * .22).toFixed(3);
  pageTurn.light.style.opacity = (shade * .32).toFixed(3);
}
function completePageTurn(commit) {
  if (!pageTurn) return;
  const turn = pageTurn;
  pageTurn = null;
  clearTimeout(turn.finishTimer);
  turn.animation?.cancel();
  if (commit) placePage(turn.target);
  else {
    placePage(turn.from, false);
    pages[turn.from].scrollTop = turn.originalTop;
  }
  turn.stage.remove();
  book.classList.remove('is-turning');
  book.dataset.turnState = 'idle';
  book.removeAttribute('aria-busy');
  enterPageMotion();
  if (commit) showGestureCue();
  const next = queuedPage;
  queuedPage = null;
  if (next !== null && next !== active) requestAnimationFrame(() => go(next));
}
function settlePageTurn(commit) {
  if (!pageTurn || pageTurn.settling) return;
  const turn = pageTurn;
  turn.settling = true;
  turn.commit = commit;
  book.dataset.turnState = 'settling';
  const destination = commit ? 1 : 0;
  const duration = reduced.matches ? 0 : Math.max(200, 720 * Math.abs(destination - turn.progress));
  // A suspended/interrupted animation must never leave navigation locked.
  turn.finishTimer = setTimeout(() => {
    if (pageTurn === turn) completePageTurn(commit);
  }, duration + 200);
  turn.animation = turn.sheet.animate([
    {transform: paperTransform(turn, turn.progress)},
    {transform: paperTransform(turn, destination)}
  ], {duration, easing: 'cubic-bezier(.45,.05,.25,1)', fill: 'forwards'});
  turn.shadow.animate([{opacity: turn.shadow.style.opacity}, {opacity: 0}], {duration, fill: 'forwards'});
  turn.light.animate([{opacity: turn.light.style.opacity}, {opacity: 0}], {duration, fill: 'forwards'});
  turn.animation.finished.then(() => {
    if (pageTurn === turn) completePageTurn(commit);
  }).catch(() => {});
}
function go(index) {
  const target = Math.max(0, Math.min(pages.length - 1, index));
  if (pageTurn) { queuedPage = target; return; }
  if (target === active) return;
  if (reduced.matches || !startPageTurn(target)) {
    placePage(target);
    enterPageMotion();
    showGestureCue();
  } else settlePageTurn(true);
}
function goToId(id) {
  const index = pages.findIndex(page => page.id === id);
  if (index >= 0) go(index);
}
function openSpot(key) { goToId('spot-' + key); }

dots.forEach(button => button.addEventListener('click', () => goToId(button.dataset.pageTarget)));
const ownsGesture = target => target.closest('input,textarea,select,[contenteditable="true"],.map-interactive,.food-map.is-interactive,.leaflet-control');
function beginSwipe(id, x, y, input) {
  swipePointer = {id, x, y, input, at: performance.now(), dx: 0, started: false};
}
book.addEventListener('pointerdown', event => {
  // Touch uses Touch Events below; handling both streams would turn twice.
  if (event.pointerType === 'touch' || !event.isPrimary || event.button !== 0 || pageTurn || ownsGesture(event.target)) return;
  beginSwipe(event.pointerId, event.clientX, event.clientY, 'pointer');
}, {passive: true});
function moveSwipe(id, x, y, event) {
  const pointer = swipePointer;
  if (!pointer || pointer.id !== id) return;
  const dx = x - pointer.x;
  const dy = y - pointer.y;
  if (!pointer.started) {
    // Let the browser own vertical movement and pinch zoom from the start.
    if (Math.abs(dy) > 10 && Math.abs(dy) >= Math.abs(dx)) { swipePointer = null; return; }
    if (Math.abs(dx) < 12 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
    const target = active + (dx < 0 ? 1 : -1);
    if (reduced.matches) {
      if (Math.abs(dx) > 55) {
        if (event.cancelable) event.preventDefault();
        go(target); suppressClickUntil = performance.now() + 400; swipePointer = null;
      }
      return;
    }
    if (event.cancelable) event.preventDefault();
    if (pointer.input === 'pointer') book.setPointerCapture(id);
    if (!startPageTurn(target)) { swipePointer = null; return; }
    pointer.started = true;
    pointer.direction = dx < 0 ? -1 : 1;
  }
  if (event.cancelable) event.preventDefault();
  pointer.dx = dx;
  updatePageTurn(pointer.direction * dx / book.clientWidth);
}
book.addEventListener('pointermove', event => {
  if (swipePointer?.input === 'pointer') moveSwipe(event.pointerId, event.clientX, event.clientY, event);
}, {passive: false});
function endSwipe(id, cancelled = false) {
  const pointer = swipePointer;
  if (!pointer || pointer.id !== id) return;
  swipePointer = null;
  if (!pointer.started) return;
  suppressClickUntil = performance.now() + 450;
  const travel = pointer.direction * pointer.dx;
  const velocity = travel / Math.max(1, performance.now() - pointer.at);
  settlePageTurn(!cancelled && (travel > book.clientWidth * .22 || (travel > 35 && velocity > .45)));
  if (pointer.input === 'pointer' && book.hasPointerCapture(id)) book.releasePointerCapture(id);
}
window.addEventListener('pointerup', event => {
  if (swipePointer?.input === 'pointer') endSwipe(event.pointerId);
});
book.addEventListener('pointercancel', event => {
  if (swipePointer?.input === 'pointer') endSwipe(event.pointerId, true);
});
book.addEventListener('lostpointercapture', event => {
  if (swipePointer?.input === 'pointer') endSwipe(event.pointerId, true);
});
book.addEventListener('touchstart', event => {
  if (event.touches.length !== 1) {
    if (swipePointer?.input === 'touch') endSwipe(swipePointer.id, true);
    return;
  }
  if (pageTurn || ownsGesture(event.target)) return;
  const touch = event.touches[0];
  beginSwipe(touch.identifier, touch.clientX, touch.clientY, 'touch');
}, {passive: true});
book.addEventListener('touchmove', event => {
  if (swipePointer?.input !== 'touch' || event.touches.length !== 1) return;
  const touch = event.touches[0];
  moveSwipe(touch.identifier, touch.clientX, touch.clientY, event);
}, {passive: false});
function endTouch(event, cancelled = false) {
  if (swipePointer?.input !== 'touch') return;
  const touch = [...event.changedTouches].find(t => t.identifier === swipePointer.id);
  if (touch) endSwipe(touch.identifier, cancelled);
}
window.addEventListener('touchend', event => endTouch(event));
window.addEventListener('touchcancel', event => endTouch(event, true));
window.addEventListener('blur', () => {
  swipePointer = null;
  if (pageTurn) completePageTurn(pageTurn.settling && pageTurn.commit);
});
book.addEventListener('click', event => {
  if (performance.now() >= suppressClickUntil) return;
  event.preventDefault();
  event.stopImmediatePropagation();
}, true);
book.addEventListener('dragstart', event => event.preventDefault());
book.addEventListener('wheel', event => {
  if (ownsGesture(event.target) || Math.abs(event.deltaX) < 2 || Math.abs(event.deltaX) < Math.abs(event.deltaY) * 1.2) return;
  event.preventDefault();
  const now = performance.now();
  if (pageTurn || now < wheelLockedUntil) return;
  wheelTotal = now - lastWheelAt < 180 ? wheelTotal + event.deltaX : event.deltaX;
  lastWheelAt = now;
  if (Math.abs(wheelTotal) < 45) return;
  go(active + Math.sign(wheelTotal));
  wheelTotal = 0;
  wheelLockedUntil = now + 900;
}, {passive: false});
document.addEventListener('keydown', event => {
  if (ownsGesture(event.target) || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  go(active + (event.key === 'ArrowRight' ? 1 : -1));
});

let observedBookWidth = book.clientWidth;
new ResizeObserver(() => {
  const width = book.clientWidth;
  syncHeight();
  if (width === observedBookWidth) return;
  observedBookWidth = width;
  if (pageTurn) completePageTurn(false);
  swipePointer = null;
  book.scrollTo({left: pageLeft(active), behavior: 'instant'});
  refreshTripMap(pages[active].id);
  refreshFoodMap(pages[active].id);
}).observe(book);
phoneLayout.addEventListener('change', () => {
  if (pageTurn) completePageTurn(false);
  swipePointer = null;
  syncHeight();
  book.scrollTo({left: pageLeft(active), behavior: 'instant'});
  refreshTripMap(pages[active].id);
  refreshFoodMap(pages[active].id);
});
reduced.addEventListener('change', () => { if (pageTurn) completePageTurn(true); });

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
