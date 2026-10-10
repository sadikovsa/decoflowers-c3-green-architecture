'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = reducedMotion.matches;
let motionTweens = [];
const motionButton = $('#motion-toggle');
const menuButton = $('.menu-toggle');
const chapterNav = $('#chapter-nav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  chapterNav.classList.toggle('open', open);
});
$$('a', chapterNav).forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  chapterNav.classList.remove('open');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && chapterNav.classList.contains('open')) {
    chapterNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.focus();
  }
});
// Keep ScrollTrigger measurements synchronous. CSS/native smooth scrolling can
// otherwise animate its temporary scroll resets and produce negative starts.
function withStableScroll(callback) {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  const x = window.scrollX;
  const y = window.scrollY;
  root.style.scrollBehavior = 'auto';
  window.scrollTo({ left: x, top: y, behavior: 'instant' });
  try { callback(); }
  finally {
    window.scrollTo({ left: x, top: y, behavior: 'instant' });
    root.style.scrollBehavior = previousBehavior;
  }
}
function refreshGeometry() {
  if (window.ScrollTrigger) withStableScroll(() => ScrollTrigger.refresh());
}
function setupMotion() {
  withStableScroll(() => {
  motionTweens.forEach(tween => { tween.scrollTrigger?.kill(); tween.kill(); });
  motionTweens = [];
  document.documentElement.classList.toggle('motion-off', motionPaused || reducedMotion.matches);
  motionButton.setAttribute('aria-pressed', String(motionPaused || reducedMotion.matches));
  motionButton.disabled = reducedMotion.matches;
  motionButton.title = reducedMotion.matches ? 'Анимация отключена согласно настройкам устройства' : '';
  motionButton.textContent = reducedMotion.matches ? 'Меньше анимации' : motionPaused ? 'Включить анимацию' : 'Пауза анимации';
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.set($('#scene-image'), { clearProps: 'transform' });
  gsap.set($$('.atlas-card'), { clearProps: 'transform' });
  gsap.set($('.scene-notes'), { clearProps: 'transform' });
  if (motionPaused || reducedMotion.matches) return;
  gsap.registerPlugin(ScrollTrigger);
  motionTweens.push(gsap.fromTo($('#scene-image'), { y: 0, scale: 1.02 }, {
    y: 55, scale: 1.09, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  }));
  motionTweens.push(gsap.to($('.scene-notes'), { y: -35, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } }));
  $$('.atlas-card:not([hidden])').forEach((card, index) => {
    motionTweens.push(gsap.fromTo(card, { y: index === 1 ? 32 : 18 }, { y: index === 1 ? -32 : -18, ease: 'none', scrollTrigger: { trigger: '.botanical-atlas', start: 'top bottom', end: 'bottom top', scrub: 1 } }));
  });
  ScrollTrigger.refresh();
  });
}
motionButton.addEventListener('click', () => { motionPaused = !motionPaused; setupMotion(); });
reducedMotion.addEventListener('change', () => { motionPaused = reducedMotion.matches; setupMotion(); });
$$('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  event.preventDefault();
  history.pushState(null, '', link.hash);
  target.scrollIntoView({ behavior: motionPaused || reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
}));
const scopeStates = {
  object: { image: 'assets/hero-object.webp', alt: 'Арт-визуализация: отдельное декоративное дерево в светлом интерьере', description: 'Одно дерево. Самостоятельный акцент в пространстве.', preset: 'Искусственные деревья' },
  composition: { image: 'assets/hero-composition.webp', alt: 'Арт-визуализация: светлая цветочная композиция на столе в интерьере', description: 'Цветы, зелень и сосуд. Сочетание, которое собирает интерьер.', preset: 'Готовые композиции' },
  wall: { image: 'assets/hero-wall.webp', alt: 'Арт-визуализация: вертикальная зелень в масштабе архитектуры', description: 'Вертикальная зелень, которая меняет восприятие пространства.', preset: 'Вертикальная фитостена' }
};
let changeGeneration = 0;
function selectScope(value) {
  const state = scopeStates[value];
  if (!state) return;
  const sceneImage = $('#scene-image');
  const generation = ++changeGeneration;
  const newImage = new Image();
  newImage.onload = () => {
    if (generation !== changeGeneration) return;
    const applyImage = () => {
      if (generation !== changeGeneration) return;
      sceneImage.src = state.image;
      sceneImage.alt = state.alt;
      sceneImage.style.opacity = '1';
      $('#scope-description').textContent = state.description;
    };
    if (motionPaused || reducedMotion.matches) applyImage();
    else { sceneImage.style.opacity = '.12'; window.setTimeout(applyImage, 230); }
  };
  newImage.onerror = () => { if (generation === changeGeneration) { $('#scope-description').textContent = state.description + ' Изображение не загрузилось; описание можно подготовить ниже.'; sceneImage.style.opacity = '1'; } };
  newImage.src = state.image;
  $(`input[name="scale"][value="${value}"]`).checked = true;
  $('#brief-scale').value = state.preset;
}
$$('input[name="scale"]').forEach(radio => radio.addEventListener('change', () => selectScope(radio.value)));
$$('[data-select]').forEach(button => button.addEventListener('click', () => {
  selectScope(button.dataset.select);
  $('#approach').scrollIntoView({ behavior: motionPaused || reducedMotion.matches ? 'instant' : 'smooth' });
  $(`input[name="scale"][value="${button.dataset.select}"]`).focus({ preventScroll: true });
}));
$$('[data-preset]').forEach(link => link.addEventListener('click', () => { $('#brief-scale').value = link.dataset.preset; }));
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  $$('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  $$('.atlas-card').forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
  $('#atlas-status').textContent = filter === 'all' ? 'Показаны все три направления.' : 'Показано направление: ' + button.textContent + '.';
  setupMotion();
}));
// Native details retain semantics; height animation only enhances their opening and closing.
$$('.accordion details').forEach(details => {
  const summary = $('summary', details);
  const content = $('div', details);
  let animation;
  summary.addEventListener('click', event => {
    if (motionPaused || reducedMotion.matches) return;
    event.preventDefault();
    animation?.cancel();
    const closing = details.open;
    if (!closing) details.open = true;
    const height = content.scrollHeight;
    animation = content.animate([
      { height: closing ? height + 'px' : '0px', opacity: closing ? 1 : 0 },
      { height: closing ? '0px' : height + 'px', opacity: closing ? 0 : 1 }
    ], { duration: 320, easing: 'cubic-bezier(.2,.65,.3,1)' });
    animation.onfinish = () => {
      details.open = !closing;
      content.style.height = '';
      refreshGeometry();
    };
  });
});
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    $$('a', chapterNav).forEach(link => {
      if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
$$('section[id]').forEach(section => sectionObserver.observe(section));
const form = $('#brief-form');
const status = $('#form-status');
function validateField(field, errorElement, message) {
  const invalid = !field.value.trim();
  field.setAttribute('aria-invalid', String(invalid));
  errorElement.textContent = invalid ? message : '';
  return !invalid;
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = $('#brief-name');
  const request = $('#brief-request');
  const nameValid = validateField(name, $('#name-error'), 'Укажите имя, чтобы команда знала, как к вам обращаться.');
  const requestValid = validateField(request, $('#request-error'), 'Опишите город и пространство, которое хотите оформить.');
  if (!nameValid || !requestValid) {
    status.textContent = 'Заполните имя и описание пространства.';
    (!nameValid ? name : request).focus();
    return;
  }
  $('#brief-draft').value = `Здравствуйте, DecoFlowers!\n\nМеня зовут ${name.value.trim()}.\nИнтересует: ${$('#brief-scale').value}.\n\nО пространстве:\n${request.value.trim()}\n\nПодскажите, пожалуйста, актуальные варианты, наличие и условия заказа.`;
  $('#draft-panel').hidden = false;
  status.textContent = 'Описание подготовлено. Отредактируйте его, скопируйте или скачайте, затем передайте DecoFlowers.';
  $('#brief-draft').focus();
});
['name', 'request'].forEach(key => {
  const field = $('#brief-' + key);
  field.addEventListener('input', () => {
    if (field.value.trim()) { field.removeAttribute('aria-invalid'); $('#' + key + '-error').textContent = ''; }
  });
});
$('#copy-brief').addEventListener('click', async () => {
  const draft = $('#brief-draft');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(draft.value);
    status.textContent = 'Описание скопировано. Передайте его DecoFlowers через удобный канал.';
  } catch {
    draft.focus(); draft.select();
    status.textContent = 'Текст выделен. Скопируйте его вручную или скачайте .txt.';
  }
});
$('#download-brief').addEventListener('click', () => {
  const text = $('#brief-draft').value;
  const blob = new Blob(['\ufeff' + text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = 'DecoFlowers-запрос.txt';
  document.body.append(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = 'Скачивание описания начато. Сам запрос не отправлен.';
});
// Content is visible without JavaScript; no entrance animations hide the page.
window.addEventListener('load', setupMotion, { once: true });
setupMotion();
