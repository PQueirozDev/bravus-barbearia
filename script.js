const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menu'); }
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
const form = document.querySelector('#booking-form');
const service = document.querySelector('#service');
const date = document.querySelector('#date');
const time = document.querySelector('#time');
const result = document.querySelector('#booking-result');
const services = { corte: { name: 'Corte', price: 55, duration: 45 }, barba: { name: 'Barba', price: 40, duration: 30 }, combo: { name: 'Corte + barba', price: 85, duration: 75 } };
const currency = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
function localDate(value) { return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`; }
date.min = localDate(new Date());
function updateTimes() {
  const previous = time.value;
  time.replaceChildren(new Option('Selecione um horário', ''));
  date.setCustomValidity('');
  if (!date.value) { time.options[0].text = 'Selecione a data'; return; }
  const selected = new Date(`${date.value}T00:00:00`);
  if (selected.getDay() === 0) { date.setCustomValidity('A barbearia fecha aos domingos. Escolha outro dia.'); time.options[0].text = 'Fechado aos domingos'; return; }
  const closing = (selected.getDay() === 6 ? 18 : 20) * 60;
  const now = new Date();
  for (let minute = 9 * 60; minute + services[service.value].duration <= closing; minute += 30) {
    const hour = `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
    if (new Date(`${date.value}T${hour}:00`) <= now) continue;
    time.add(new Option(hour, hour));
  }
  if (time.options.length === 1) time.options[0].text = 'Escolha outra data';
  if ([...time.options].some(option => option.value === previous)) time.value = previous;
}
function updateService() { const chosen = services[service.value]; document.querySelector('#total').textContent = currency(chosen.price); document.querySelector('#duration').textContent = `${chosen.duration} min de cuidado`; updateTimes(); result.hidden = true; }
service.addEventListener('change', updateService);
date.addEventListener('change', updateTimes);
form.addEventListener('input', () => { result.hidden = true; });
document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => { service.value = button.dataset.service; updateService(); document.querySelector('#agendamento').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }));
document.querySelectorAll('[data-barber]').forEach(link => link.addEventListener('click', () => { document.querySelector('#barber').value = link.dataset.barber; result.hidden = true; }));
form.addEventListener('submit', event => {
  event.preventDefault();
  date.min = localDate(new Date());
  updateTimes();
  const name = form.elements.name.value.trim();
  form.elements.name.setCustomValidity(name.length < 2 ? 'Informe seu nome.' : '');
  if (!form.reportValidity()) return;
  const chosen = services[service.value];
  const formatted = new Date(`${date.value}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  const barber = document.querySelector('#barber').value;
  result.textContent = `${name}, sua simulação está pronta: ${chosen.name}, dia ${formatted}, às ${time.value}, ${barber === 'Sem preferência' ? 'com profissional sem preferência' : `com ${barber}`}. Total: ${currency(chosen.price)}. Esta é uma demonstração; nenhuma reserva foi efetuada.`;
  result.hidden = false;
  result.focus({ preventScroll: true });
  result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
});
form.elements.name.addEventListener('input', () => form.elements.name.setCustomValidity(''));
document.querySelector('#year').textContent = new Date().getFullYear();
