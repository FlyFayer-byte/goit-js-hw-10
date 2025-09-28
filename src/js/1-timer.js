// src/js/1-timer.js
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

// Початковий стан
refs.startBtn.disabled = true;

let userSelectedDate = null; // дата, обрана користувачем (ms)
let timerId = null;

// --- Flatpickr ---
flatpickr(refs.input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const date = selectedDates[0];
    if (!date || date.getTime() <= Date.now()) {
      // невалідна дата → блокуємо старт і показуємо тост
      userSelectedDate = null;
      refs.startBtn.disabled = true;
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
        timeout: 3000,
      });
      return;
    }
    // валідна дата → зберігаємо й розблоковуємо кнопку
    userSelectedDate = date.getTime();
    refs.startBtn.disabled = false;
  },
});

// --- Запуск таймера ---
refs.startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  refs.startBtn.disabled = true; // не даємо запустити ще раз
  refs.input.disabled = true;    // блокуємо вибір нової дати

  tick();                        // перший апдейт одразу
  timerId = setInterval(tick, 1000);
});

function tick() {
  const ms = userSelectedDate - Date.now();

  if (ms <= 0) {
    clearInterval(timerId);
    timerId = null;
    setClock(0, 0, 0, 0);
    refs.input.disabled = false;   // можна обрати наступну дату
    // Кнопка Start лишається неактивною, доки не оберуть нову валідну дату
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(ms);
  setClock(days, hours, minutes, seconds);
}

// Форматуємо відображення часу
function setClock(d, h, m, s) {
  refs.days.textContent = addLeadingZero(d);    // дні можуть бути >2 цифр — padStart їх не псує
  refs.hours.textContent = addLeadingZero(h);
  refs.minutes.textContent = addLeadingZero(m);
  refs.seconds.textContent = addLeadingZero(s);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Готова функція конвертації з ТЗ
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}
