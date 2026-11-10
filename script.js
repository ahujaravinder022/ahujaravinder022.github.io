// Tabs: show one panel at a time, driven by the URL hash
const panels = document.querySelectorAll('.tab-panel');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const DEFAULT_TAB = 'about';

function showTab(id, scroll) {
  if (![...panels].some(p => p.id === id)) id = DEFAULT_TAB;
  panels.forEach(p => p.classList.toggle('active', p.id === id));
  navLinks.forEach(a => a.setAttribute('aria-selected', a.getAttribute('href') === '#' + id));
  if (scroll) document.getElementById(id).scrollIntoView();
}

window.addEventListener('hashchange', () => showTab(location.hash.slice(1), true));
showTab(location.hash.slice(1), false);

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinksList = document.getElementById('nav-links');

function setMenu(open) {
  navLinksList.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
}

hamburger.addEventListener('click', () => setMenu(!navLinksList.classList.contains('open')));

// Close mobile menu on link click
navLinksList.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => setMenu(false));
});

// Dark mode
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function applyTheme(dark) {
  if (dark) root.dataset.theme = 'dark'; else delete root.dataset.theme;
  themeToggle.textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

themeToggle.textContent = root.dataset.theme === 'dark' ? '☀️' : '🌙';
themeToggle.addEventListener('click', () => applyTheme(root.dataset.theme !== 'dark'));

// Back to top
const toTop = document.getElementById('to-top');
window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 600);
}, { passive: true });
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Publication search (filters the visible tab; "empty" message if no match)
const pubSearch = document.getElementById('pub-search');
const pubEmpty = document.getElementById('pub-empty');

function filterPubs() {
  const q = pubSearch.value.trim().toLowerCase();
  document.querySelectorAll('.pub-item').forEach(item => {
    item.hidden = q !== '' && !item.textContent.toLowerCase().includes(q);
  });
  const active = document.querySelector('.pub-list.active');
  pubEmpty.hidden = !active || active.querySelectorAll('.pub-item:not([hidden])').length > 0;
}

pubSearch.addEventListener('input', filterPubs);

// Publication tabs
document.querySelectorAll('.pub-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.pub-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.pub-list').forEach(l => l.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('pub-' + target).classList.add('active');
    filterPubs();
  });
});
