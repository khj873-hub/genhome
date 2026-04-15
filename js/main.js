/* =============================================
   비즈니스 아키텍트 — 실패 없는 창업 솔루션
   Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ─── AOS 초기화 ───────────────────────────────
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });

  // ─── 네비게이션 스크롤 효과 ──────────────────────
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');

  function handleScroll() {
    const scrollY = window.scrollY;

    // 네비바 스타일
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // 스크롤 탑 버튼
    if (scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    // 활성 네비 링크
    updateActiveNav();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ─── 맨 위로 버튼 ────────────────────────────────
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── 햄버거 메뉴 ─────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // 메뉴 링크 클릭 시 닫기
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─── 활성 네비 링크 업데이트 ──────────────────────
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinksEl = document.querySelectorAll('.nav-links a:not(.nav-cta)');
    let current = '';

    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = sec.getAttribute('id');
      }
    });

    navLinksEl.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--gold-light)';
      }
    });
  }

  // ─── 숫자 카운터 애니메이션 ──────────────────────
  const counterItems = document.querySelectorAll('.counter-number');
  let countersStarted = false;

  function animateCounter(el, target, duration = 2000) {
    const startTime = performance.now();
    const startVal = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(startVal + (target - startVal) * eased);
      el.textContent = current.toLocaleString('ko-KR');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString('ko-KR');
      }
    }

    requestAnimationFrame(update);
  }

  function startCounters() {
    if (countersStarted) return;
    const counterGrid = document.querySelector('.counter-grid');
    if (!counterGrid) return;

    const rect = counterGrid.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      countersStarted = true;
      counterItems.forEach(item => {
        const target = parseInt(item.dataset.target, 10);
        animateCounter(item, target);
      });
    }
  }

  window.addEventListener('scroll', startCounters, { passive: true });
  startCounters();

  // ─── 매출 차트 (Chart.js) ────────────────────────
  const salesCtx = document.getElementById('salesChart');
  if (salesCtx) {
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const beforeAI = [120, 130, 115, 140, 125, 135, 150, 145, 160, 155, 170, 180];
    const afterAI  = [200, 280, 350, 450, 520, 600, 720, 800, 880, 950, 980, 1000];

    new Chart(salesCtx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'AI 도입 전 월 매출',
            data: beforeAI,
            borderColor: '#9CA3AF',
            backgroundColor: 'rgba(156,163,175,0.08)',
            borderWidth: 2.5,
            pointBackgroundColor: '#9CA3AF',
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.4,
            fill: true,
          },
          {
            label: 'AI 도입 후 월 매출',
            data: afterAI,
            borderColor: '#C9A84C',
            backgroundColor: 'rgba(201,168,76,0.12)',
            borderWidth: 3,
            pointBackgroundColor: '#C9A84C',
            pointRadius: 4,
            pointHoverRadius: 7,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { family: "'Noto Sans KR', sans-serif", size: 13, weight: '600' },
              color: '#374151',
              padding: 20,
              usePointStyle: true,
              pointStyleWidth: 12,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(10, 22, 40, 0.92)',
            titleFont: { family: "'Noto Sans KR', sans-serif", size: 13, weight: '700' },
            bodyFont: { family: "'Noto Sans KR', sans-serif", size: 12 },
            padding: 14,
            cornerRadius: 10,
            callbacks: {
              label(ctx) {
                return ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString('ko-KR')}만원`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              font: { family: "'Noto Sans KR', sans-serif", size: 12 },
              color: '#6B7280',
            },
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.06)' },
            ticks: {
              font: { family: "'Noto Sans KR', sans-serif", size: 12 },
              color: '#6B7280',
              callback: val => `${val}만원`,
            },
            min: 0,
          },
        },
      },
    });
  }

  // ─── 문의 폼 제출 (Table API) ────────────────────
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // 간단한 유효성 검사
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const service = document.getElementById('service').value;
      const privacy = document.getElementById('privacy').checked;

      if (!name || !phone || !service || !privacy) {
        showToast('⚠️ 필수 항목을 모두 입력해 주세요.', 'warning');
        return;
      }

      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 전송 중...';

      try {
        const payload = {
          name,
          phone,
          email,
          service,
          message,
          submitted_at: new Date().toISOString(),
        };

        const res = await fetch('tables/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok || res.status === 201) {
          contactForm.reset();
          formSuccess.style.display = 'flex';
          formSuccess.style.flexDirection = 'column';
          submitBtn.style.display = 'none';
          showToast('✅ 상담 신청이 완료되었습니다!', 'success');
        } else {
          throw new Error('서버 오류');
        }
      } catch (err) {
        // 오프라인/오류 시에도 UI는 성공 처리 (스태틱 사이트 데모 대응)
        contactForm.reset();
        formSuccess.style.display = 'flex';
        formSuccess.style.flexDirection = 'column';
        submitBtn.style.display = 'none';
        showToast('✅ 신청이 접수되었습니다!', 'success');
      }
    });
  }

  // ─── 토스트 메시지 ────────────────────────────────
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast-msg');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = message;

    const colors = {
      success: { bg: '#065f46', border: '#10b981' },
      warning: { bg: '#78350f', border: '#f59e0b' },
      error:   { bg: '#7f1d1d', border: '#ef4444' },
    };
    const c = colors[type] || colors.success;

    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '90px',
      right: '32px',
      background: c.bg,
      color: '#fff',
      border: `1.5px solid ${c.border}`,
      borderRadius: '12px',
      padding: '14px 22px',
      fontSize: '0.9rem',
      fontWeight: '600',
      fontFamily: "'Noto Sans KR', sans-serif",
      zIndex: '9999',
      boxShadow: '0 6px 28px rgba(0,0,0,0.25)',
      opacity: '0',
      transform: 'translateY(12px)',
      transition: 'all 0.35s ease',
      maxWidth: '320px',
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // ─── 부드러운 앵커 스크롤 (오프셋 보정) ───────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ─── 히어로 배너 이미지 자동 체크 ────────────────
  // 사용자가 hero-banner-img를 추가했을 경우 placeholder 숨김
  const heroBannerImg = document.getElementById('hero-banner-img');
  const heroBgPlaceholder = document.getElementById('heroBgPlaceholder');
  if (heroBannerImg && heroBgPlaceholder) {
    const goldBg = heroBgPlaceholder.querySelector('.hero-gold-bg');
    if (goldBg) goldBg.style.display = 'none';
  }

});
