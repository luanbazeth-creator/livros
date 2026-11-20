(() => {
  'use strict';
  const cfg = window.LIVRO_CONFIG || {};
  const $ = (sel) => document.querySelector(sel);
  const escape = (text) => String(text ?? '').replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const nl2br = (text) => escape(text).replace(/\n/g, '<br>');
  const name = () => escape(cfg.nomeDela || 'Minha princesa');
  const byline = () => escape(cfg.seuNome || 'Seu príncipe');

  const ornaments = `<span class="page-ornament" aria-hidden="true">✧ &nbsp; ♡ &nbsp; ✧</span>`;
  const header = (chapter, title) => `<div class="page-heading"><span class="page-kicker">${chapter}</span><h3>${title}</h3>${ornaments}</div>`;
  const footer = (num) => `<span class="folio" aria-hidden="true">✦ &nbsp; ${String(num).padStart(2, '0')} &nbsp; ✦</span>`;
  const page = (type, content, num) => `<article class="storybook-page page-${type}"><div class="page-border"><div class="page-surface">${content}</div>${footer(num)}</div></article>`;

  function counterMarkup() {
    if (!cfg.dataInicio) {
      return `<div class="time-number" aria-label="Nossa história é infinita">∞</div><div class="time-unit">momentos para guardar</div><p class="body-copy">Tem coisa que nem precisa de calendário: a vontade de dividir meus dias com você é uma delas. E que ainda venham muitos momentos para contar.</p>`;
    }
    const parsed = new Date(`${cfg.dataInicio}T12:00:00`);
    if (Number.isNaN(parsed.getTime())) return `<p class="body-copy">Cada segundo ao seu lado é um presente. ♡</p>`;
    const now = new Date();
    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const start = Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
    const days = Math.max(0, Math.round((today - start) / 86400000));
    return `<div class="time-number">${days.toLocaleString('pt-BR')}</div><div class="time-unit">${days === 1 ? 'dia' : 'dias'} escrevendo nosso conto</div><p class="body-copy">Não são apenas números. São dias de conversa, risadas, saudade, reencontros e mais motivos para te escolher.</p>`;
  }

  const photoPage = (index, chapter, title, folio) => {
    const src = ((cfg.fotos || [])[index] || '').trim();
    const caption = escape((cfg.legendasFotos || [])[index] || 'Um momento que vale guardar');
    const note = escape((cfg.frasesFotos || [])[index] || 'Uma lembrança especial com você.');
    const img = src ? `<img src="${escape(src)}" alt="Nossa fotografia ${index+1}, em ordem de lembranças" loading="lazy">` : `<div class="no-photo">♡</div>`;
    return page('photo-memory', `${header(chapter, title)}<figure class="storybook-photo-frame"><div class="story-photo-well">${img}</div><figcaption>${caption} ✦</figcaption></figure><p class="storybook-photo-note">${note}</p>`, folio);
  };

  function makePages() { return [
    page('dedication', `<div class="small-crown">♕</div>${header('UMA DEDICATÓRIA', `Para ${name()}`)}<p class="body-copy centered">${escape(cfg.dedicatória)}</p><img class="castle-art" src="assets/castelo.webp" alt="Castelo encantado ao entardecer"><p class="page-signoff">Com amor, ${byline()}</p>`, 1),
    page('opening', `${header('ANTES DE TUDO', 'Era uma vez nós dois...')}<div class="dropcap-copy">${escape(cfg.primeiraPagina)}</div><div class="quote-ornament">❝</div><blockquote class="book-quote">Nem toda magia precisa de feitiço. Às vezes, ela chega com o seu sorriso.</blockquote><div class="soft-stars" aria-hidden="true">✧　✦　✧</div>`, 2),
    page('chapter', `${header('CAPÍTULO I', 'O começo de tudo')}<div class="chapter-medallion" aria-hidden="true">✦<span>♡</span>✦</div><p class="body-copy centered">${escape(cfg.capituloUm)}</p><p class="handwritten">E pensar que ainda temos tanta coisa para viver...</p>`, 3),
    photoPage(0, 'PRIMEIRA LEMBRANÇA', 'Um momento só nosso', 4),
    page('details', `${header('UM ENCANTO PARTICULAR', 'Meu lugar favorito')}<p class="body-copy">${escape(cfg.textoEspecial)}</p><div class="heart-list"><span>♡</span> O seu jeitinho que me conquista.<br><span>♡</span> As nossas conversas sem roteiro.<br><span>♡</span> O conforto de estar com você.</div><p class="handwritten">O que eu mais gosto é da gente sendo a gente.</p>`, 5),
    photoPage(1, 'SEGUNDA LEMBRANÇA', 'A gente do nosso jeito', 6),
    page('memories-intro', `${header('CAPÍTULO II', 'Nosso álbum de vida')}<div class="memory-frame"><div class="memory-frame-inner"><span>✧</span><strong>Se amor virasse fotografia, meu álbum preferido seria cheio de nós dois.</strong><span>♡</span></div></div><p class="body-copy centered">${escape(cfg.capituloDois)}</p>`, 7),
    photoPage(2, 'TERCEIRA LEMBRANÇA', 'Carinho que fica', 8),
    page('promises', `${header('CAPÍTULO III', 'Pequenas promessas')}<p class="body-copy centered">Eu não tenho como adivinhar o futuro, mas sei uma coisa: quero continuar descobrindo a vida com você.</p><div class="promise-list"><div><span>✧</span><p>${escape(cfg.promessaUm)}</p></div><div><span>♡</span><p>${escape(cfg.promessaDois)}</p></div><div><span>✦</span><p>${escape(cfg.promessaTres)}</p></div></div>`, 9),
    photoPage(3, 'QUARTA LEMBRANÇA', 'Até o espelho sabe', 10),
    page('time', `${header('O QUE AINDA VEM AÍ', 'Uma história sem fim')}<div class="time-container"><div class="time-rose" aria-hidden="true">❦</div>${counterMarkup()}</div><div class="bottom-vine" aria-hidden="true">✧　♡　✧</div>`, 11),
    page('secret', `${header('UMA PÁGINA SECRETA', 'Uma carta para você')}<p class="body-copy centered">Tem coisas que eu penso quando estamos juntos e nem sempre digo na hora. Guardei algumas aqui. Só para você.</p><button class="letter-button" type="button" aria-label="Abrir a carta de amor"><span class="envelope" aria-hidden="true"><span class="envelope-heart">♥</span></span><span class="letter-cta">Toque para abrir sua cartinha</span></button><div class="letter-content" hidden><p>${nl2br(cfg.carta)}</p><span>Com amor, ${byline()} ♡</span></div>`, 12),
    page('chapter', `${header('E TEM MAIS...', 'O que eu sei de nós')}<div class="chapter-medallion" aria-hidden="true">✦<span>♥</span>✦</div><p class="body-copy centered">Não sei quantas páginas a vida ainda vai nos dar. Mas tenho uma certeza bonita: eu quero continuar juntando memórias contigo, com toda a bagunça, alegria e carinho que fazem a gente ser quem é.</p><p class="handwritten">Meu futuro tem muita vontade de você.</p>`, 13),
    page('ending', `${header('CONTINUA...', 'Nosso para sempre')}<div class="ending-illustration"><img src="assets/ilustracao-capa.webp" alt="Um casal apaixonado em um conto de fadas"></div><p class="body-copy centered ending-message">${escape(cfg.ultimoRecado)}</p><p class="end-note">E assim começa o nosso próximo capítulo...<br><strong>juntos.</strong> ♡</p><button class="restart-button" type="button">Recomeçar nossa história ↶</button>`, 14)
  ]; }
  let pages = makePages();

  const totalSheets = pages.length / 2;
  let turns = 0;
  let mobileIndex = 0;
  let animating = false;
  let lastMobile = window.matchMedia('(max-width: 760px)').matches;
  const cover = $('#cover-screen');
  const reader = $('#reading-screen');
  const sheets = $('#sheets-container');
  const mobilePage = $('#mobile-page');
  const mobileFlip = $('#mobile-flip');
  const prev = $('#prev-page');
  const next = $('#next-page');
  const progressText = $('#progress-text');
  const progressDots = $('#progress-dots');

  $('#cover-to').textContent = `Uma história dedicada a ${cfg.nomeDela || 'você'}`;
  document.title = `Nosso Conto de Fadas ♡ ${cfg.nomeDela || 'Para você'}`;

  function makeSheets() {
    sheets.innerHTML = pages.reduce((html, item, i) => {
      if (i % 2) return html;
      const index = i / 2;
      return html + `<div class="sheet" data-index="${index}" style="z-index:${totalSheets-index}"><div class="sheet-front">${pages[i]}</div><div class="sheet-back">${pages[i+1]}</div></div>`;
    }, '');
    progressDots.innerHTML = "";
    for (let i = 0; i <= totalSheets; i++) {
      progressDots.insertAdjacentHTML('beforeend', '<span class="progress-dot"></span>');
    }
  }
  makeSheets();

  function getMobile() { return window.matchMedia('(max-width: 760px)').matches; }
  function getVisibleNumber() { return getMobile() ? mobileIndex+1 : Math.min(pages.length, 1 + turns*2); }
  function updateProgress() {
    const isMobile = getMobile();
    const atStart = isMobile ? mobileIndex === 0 : turns === 0;
    const atEnd = isMobile ? mobileIndex === pages.length-1 : turns === totalSheets;
    prev.disabled = atStart || animating;
    next.disabled = atEnd || animating;
    progressText.textContent = isMobile ? `Página ${mobileIndex+1} de ${pages.length}` : turns === totalSheets ? 'Fim do livro ♡' : `Capítulo ${turns+1} de ${totalSheets}`;
    [...progressDots.children].forEach((dot, i) => {dot.classList.toggle('active', i === turns);});
    next.querySelector('span').textContent = atEnd ? 'Fim' : 'Próxima';
  }
  function syncSheets() {
    [...sheets.children].forEach((sheet, idx) => {
      const flipped = idx < turns;
      sheet.classList.toggle('is-flipped', flipped);
      sheet.style.zIndex = flipped ? String(idx + 1) : String(totalSheets - idx);
    });
    updateProgress();
  }
  function setMobilePage() {
    mobilePage.innerHTML = pages[mobileIndex];
    mobilePage.querySelectorAll('.letter-content').forEach(x=>x.hidden=true);
    updateProgress();
  }

  function releaseAnimation() {
    animating = false;
    syncSheets();
    updateProgress();
  }
  function desktopTurn(direction) {
    if (animating) return;
    if (direction > 0 && turns >= totalSheets || direction < 0 && turns <= 0) return;
    animating = true;
    updateProgress();
    const index = direction > 0 ? turns : turns - 1;
    const sheet = sheets.children[index];
    sheet.style.zIndex = '100';
    // Force reflow so browsers animate the paper and not the whole page.
    void sheet.offsetWidth;
    sheet.classList.toggle('is-flipped', direction > 0);
    turns += direction;
    window.setTimeout(releaseAnimation, 850);
  }
  function mobileTurn(direction) {
    if (animating) return;
    const target = mobileIndex + direction;
    if (target < 0 || target >= pages.length) return;
    animating = true;
    updateProgress();
    mobileFlip.innerHTML = mobilePage.innerHTML;
    mobileFlip.className = `mobile-flip ${direction > 0 ? 'turn-forward' : 'turn-backward'}`;
    mobileFlip.style.display = 'block';
    mobileIndex = target;
    setMobilePage();
    mobilePage.classList.add('mobile-page-reveal');
    window.setTimeout(() => {
      mobileFlip.style.display = 'none';
      mobileFlip.className = 'mobile-flip';
      mobilePage.classList.remove('mobile-page-reveal');
      animating = false;
      updateProgress();
    }, 610);
  }
  function navigate(direction) { getMobile() ? mobileTurn(direction) : desktopTurn(direction); }

  function goToCover() {
    if (animating) return;
    reader.hidden = true;
    cover.hidden = false;
    $('.closed-book').classList.remove('is-opening');
    window.scrollTo({top:0, behavior:'smooth'});
  }
  function openBook() {
    if (animating) return;
    animating = true;
    $('.closed-book').classList.add('is-opening');
    window.setTimeout(() => {
      cover.hidden = true;
      reader.hidden = false;
      animating = false;
      syncSheets();
      setMobilePage();
      window.scrollTo({top:0, behavior:'smooth'});
    }, 560);
  }

  function burstHearts(target) {
    const burst = $('#heart-burst');
    const rect = target.getBoundingClientRect();
    for (let i=0;i<14;i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = i%3 ? '♥' : '✦';
      heart.style.left = `${rect.left + rect.width/2 + (Math.random()-.5)*85}px`;
      heart.style.top = `${rect.top + rect.height/2}px`;
      heart.style.setProperty('--floatX', `${(Math.random()-.5)*210}px`);
      heart.style.setProperty('--floatY', `${-85-Math.random()*140}px`);
      heart.style.animationDelay = `${Math.random()*.18}s`;
      burst.appendChild(heart);
      window.setTimeout(()=> heart.remove(), 1800);
    }
  }

  document.addEventListener('click', (event) => {
    const letter = event.target.closest('.letter-button');
    if (letter) {
      const parent = letter.closest('.storybook-page');
      const content = parent.querySelector('.letter-content');
      if (content) {
        const isOpening = content.hidden;
        content.hidden = !isOpening;
        letter.classList.toggle('letter-open', isOpening);
        letter.querySelector('.letter-cta').textContent = isOpening ? 'Fechar cartinha ♡' : 'Toque para abrir sua cartinha';
        if (isOpening) burstHearts(letter);
      }
    }
    if (event.target.closest('.restart-button')) {
      mobileIndex = 0;
      turns = 0;
      syncSheets();
      setMobilePage();
      goToCover();
    }
  });

  $('#open-book').addEventListener('click', openBook);
  $('#closed-book').addEventListener('click', (event) => { if (!event.target.closest('#open-book')) openBook(); });
  prev.addEventListener('click', () => navigate(-1));
  next.addEventListener('click', () => navigate(1));
  $('#back-to-cover').addEventListener('click', goToCover);
  document.addEventListener('keydown', (event) => {
    if (reader.hidden || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target instanceof HTMLElement && event.target.matches('input,textarea')) return;
    if (event.key === 'ArrowRight') {event.preventDefault();navigate(1);}
    if (event.key === 'ArrowLeft') {event.preventDefault();navigate(-1);}
    if (event.key === 'Escape') goToCover();
  });

  let touchStartX = 0;
  let touchStartY = 0;
  mobilePage.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
  }, {passive:true});
  mobilePage.addEventListener('touchend', (event) => {
    const distanceX = event.changedTouches[0].screenX - touchStartX;
    const distanceY = event.changedTouches[0].screenY - touchStartY;
    if (Math.abs(distanceX) > 60 && Math.abs(distanceX) > 1.3 * Math.abs(distanceY)) navigate(distanceX < 0 ? 1 : -1);
  }, {passive:true});
  window.addEventListener('resize', () => {
    const isMobile = getMobile();
    if (isMobile !== lastMobile && !reader.hidden) {
      if (isMobile) { mobileIndex = Math.min(pages.length - 1, turns * 2); setMobilePage(); }
      else { turns = Math.min(totalSheets, Math.ceil(mobileIndex / 2)); syncSheets(); }
      lastMobile = isMobile;
    }
  });

  // Decorative stars. Seeded deterministic positions keep the sky stable.
  let seed = 42;
  const random = () => {seed = (seed*16807)%2147483647;return (seed-1)/2147483646;};
  const starLayer = $('#sky-stars');
  for (let i = 0; i < 62; i++) {
    const star = document.createElement('span');
    star.className = 'sky-star';
    star.style.left = `${random()*100}%`;
    star.style.top = `${random()*100}%`;
    star.style.width = star.style.height = `${1+random()*2.4}px`;
    star.style.animationDelay = `${random()*5}s`;
    star.style.animationDuration = `${2.5+random()*4}s`;
    starLayer.appendChild(star);
  }
  updateProgress();
})();
