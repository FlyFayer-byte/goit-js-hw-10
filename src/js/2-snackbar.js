import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const delayStr = e.currentTarget.elements.delay.value.trim();
  const state = e.currentTarget.elements.state.value; // 'fulfilled' | 'rejected'
  const delay = Number(delayStr);

  // Проста валідація (HTML already requires + min=0)
  if (!Number.isFinite(delay) || delay < 0) {
    iziToast.error({ message: 'Enter a non-negative delay (ms)', position: 'topRight' });
    return;
  }

  createPromise(delay, state === 'fulfilled')
    .then(ms => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${ms}ms`,
        position: 'topRight',
      });
    })
    .catch(ms => {
      iziToast.error({
        message: `❌ Rejected promise in ${ms}ms`,
        position: 'topRight',
      });
    });
});

function createPromise(delay, shouldResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) resolve(delay);
      else reject(delay);
    }, delay);
  });
}
