const revealTargets = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.2 }
);

for (const target of revealTargets) {
  revealObserver.observe(target);
}

const navHeaders = document.querySelectorAll('.site-header');

for (const header of navHeaders) {
  const toggle = header.querySelector('.nav-toggle');
  const nav = header.querySelector('.nav');
  if (!toggle || !nav) continue;

  const closeMenu = () => {
    header.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (toggle.offsetParent === null) {
      closeMenu();
    }
  });
}

const copyButton = document.querySelector('.copy-btn');
const toast = document.getElementById('toast');

if (copyButton && toast) {
  copyButton.addEventListener('click', async () => {
    const textToCopy = copyButton.dataset.copy || '';
    const label = copyButton.dataset.label || '内容';

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.textContent = `${label}をコピーしました。`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1800);
    } catch (error) {
      toast.textContent = 'コピーに失敗しました。';
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        toast.textContent = 'コピーしました。';
      }, 1800);
    }
  });
}

const downloadLinks = document.querySelectorAll('.download-link');

for (const link of downloadLinks) {
  link.addEventListener('click', async (event) => {
    const url = link.getAttribute('href');
    if (!url) return;
    const lowerUrl = url.toLowerCase();

    // zipはブラウザ標準ダウンロードに任せる。
    if (lowerUrl.endsWith('.zip')) {
      return;
    }

    event.preventDefault();

    const filename =
      link.getAttribute('download') ||
      url.split('/').pop() ||
      'download-file';

    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.location.href = url;
    }
  });
}
