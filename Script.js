

document.addEventListener('DOMContentLoaded', function () {

  
  const typedEl = document.querySelector('[data-typed]');
  if (typedEl) {
    const words = JSON.parse(typedEl.getAttribute('data-typed'));
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = words[wordIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(tick, deleting ? 45 : 85);
    }
    tick();
  }

  
  const bars = document.querySelectorAll('.extrude-fill');
  if (bars.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.style.width = target.getAttribute('data-level') + '%';
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach((bar) => observer.observe(bar));
  }

  
  const printerBtn = document.getElementById('printer-toggle');
  if (printerBtn) {
    const statusText = document.getElementById('printer-status');
    let printing = false;
    printerBtn.addEventListener('click', function () {
      printing = !printing;
      if (printing) {
        statusText.textContent = 'A imprimir… camada 1/240';
        statusText.classList.remove('text-circuit');
        statusText.classList.add('text-filament');
        printerBtn.textContent = 'Parar impressão';
        let layer = 1;
        printerBtn.dataset.interval = setInterval(function () {
          layer++;
          if (layer > 240) layer = 1;
          statusText.textContent = 'A imprimir… camada ' + layer + '/240';
        }, 250);
      } else {
        clearInterval(printerBtn.dataset.interval);
        statusText.textContent = 'Impressora em repouso';
        statusText.classList.remove('text-filament');
        statusText.classList.add('text-circuit');
        printerBtn.textContent = 'Iniciar impressão';
      }
    });
  }

  
  const form = document.getElementById('contact-form');
  if (form) {
    const feedback = document.getElementById('form-feedback');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const nome = document.getElementById('nome');
      const email = document.getElementById('email');
      const mensagem = document.getElementById('mensagem');
      let valid = true;
      let errors = [];

      [nome, email, mensagem].forEach((field) => field.classList.remove('is-invalid'));

      if (nome.value.trim().length < 2) {
        errors.push('Indica o teu nome.');
        nome.classList.add('is-invalid');
        valid = false;
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        errors.push('Indica um email válido.');
        email.classList.add('is-invalid');
        valid = false;
      }
      if (mensagem.value.trim().length < 10) {
        errors.push('A mensagem deve ter pelo menos 10 caracteres.');
        mensagem.classList.add('is-invalid');
        valid = false;
      }

      feedback.classList.remove('d-none', 'alert-success', 'alert-danger');
      if (!valid) {
        feedback.classList.add('alert-danger');
        feedback.innerHTML = errors.join('<br>');
      } else {
        feedback.classList.add('alert-success');
        feedback.textContent = 'É só um teste 😜';
        form.reset();
      }
    });
  }

});