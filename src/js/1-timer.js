// src/js/1-timer.js
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.disabled = true;

let selectedTime = null;
let timerId = null;

// 1) ініціалізація flatpickr
flatpickr(refs.input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const date = selectedDates[0];
    if (!date) return;
    if (date.getTime() <= Date.now()) {
      refs.startBtn.disabled = true;
      alert('Please choose a date in the future');
      return;
    }
    selectedTime = date.getTime();
    refs.startBtn.disabled = false;
  },
});

// 2) запуск відліку
refs.startBtn.addEventListener('click', () => {
  if (!selectedTime) return;

  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  tick(); // одразу показати перший розрахунок
  timerId = setInterval(tick, 1000);
});

function tick() {
  const ms = selectedTime - Date.now();

  if (ms <= 0) {
    clearInterval(timerId);
    timerId = null;
    setClock(0, 0, 0, 0);
    refs.input.disabled = false;
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(ms);
  setClock(days, hours, minutes, seconds);
}

function setClock(d, h, m, s) {
  refs.days.textContent = String(d).padStart(2, '0');
  refs.hours.textContent = String(h).padStart(2, '0');
  refs.minutes.textContent = String(m).padStart(2, '0');
  refs.seconds.textContent = String(s).padStart(2, '0');
}

function convertMs(ms) {
  const sec = 1000;
  const min = sec * 60;
  const hour = min * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / min);
  const seconds = Math.floor((ms % min) / sec);
  return { days, hours, minutes, seconds };
}
