import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

iziToast.settings({
  position: 'topRight',
  timeout: 3000,
  closeOnClick: true,
  progressBar: false,
  maxWidth: 420,
  transitionIn: 'fadeInDown',
  transitionOut: 'fadeOutUp',
});

const form = document.querySelector('.form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const delayStr = form.elements.delay.value.trim();
  const delay = Number(delayStr);
  const state = form.elements.state.value; // 'fulfilled' | 'rejected'


  if (!Number.isFinite(delay) || delay < 0) {
    iziToast.error({ message: 'Enter a non-negative delay (ms)' });
    return;
  }
  if (state !== 'fulfilled' && state !== 'rejected') {
    iziToast.error({ message: 'Choose promise state' });
    return;
  }

  createPromise(delay, state === 'fulfilled')
    .then(ms => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${ms}ms`,
      });
    })
    .catch(ms => {
      iziToast.error({
        message: `❌ Rejected promise in ${ms}ms`,
      });
    });
});

// Створює проміс, що виконається або відхилиться через delay мс
function createPromise(delay, shouldResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      shouldResolve ? resolve(delay) : reject(delay);
    }, delay);
  });
}
