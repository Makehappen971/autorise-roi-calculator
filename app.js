'use strict';

// ── Register Service Worker ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}

// ── DOM refs ──
const form          = document.getElementById('roiForm');
const resultsEl     = document.getElementById('results');
const resetBtn      = document.getElementById('resetBtn');

const outClientName  = document.getElementById('outClientName');
const outHoursWasted = document.getElementById('outHoursWasted');
const outAnnualCost  = document.getElementById('outAnnualCost');
const outSavings     = document.getElementById('outSavings');
const outROI         = document.getElementById('outROI');
const outPayback     = document.getElementById('outPayback');
const roiFill        = document.getElementById('roiFill');
const roiPct         = document.getElementById('roiPct');
const roiSubText     = document.getElementById('roiSubText');

const AUTORISE_INVESTMENT = 10_000;
const EFFICIENCY_GAIN     = 0.70;

// ── Format helpers ──
function fmt(n) {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000)     return '$' + Math.round(n).toLocaleString();
  return '$' + n.toFixed(0);
}

function fmtNum(n) {
  return Math.round(n).toLocaleString();
}

// ── Calculate ──
function calculate(e) {
  e.preventDefault();

  const company   = document.getElementById('companyName').value.trim() || 'Your Company';
  const employees = parseFloat(document.getElementById('employees').value);
  const hours     = parseFloat(document.getElementById('hoursPerWeek').value);
  const wage      = parseFloat(document.getElementById('hourlyWage').value);

  if (!employees || !hours || !wage) return;

  // Core math
  const annualHours   = employees * hours * 52;
  const annualCost    = annualHours * wage;
  const savings       = annualCost * EFFICIENCY_GAIN;
  const netROI        = ((savings - AUTORISE_INVESTMENT) / AUTORISE_INVESTMENT) * 100;
  const paybackMonths = (AUTORISE_INVESTMENT / savings) * 12;

  // Populate results
  outClientName.textContent  = company;
  outHoursWasted.textContent = fmtNum(annualHours);
  outAnnualCost.textContent  = fmt(annualCost);
  outSavings.textContent     = fmt(savings);
  outROI.textContent         = Math.round(netROI).toLocaleString() + '%';
  outPayback.textContent     = paybackMonths < 1
    ? 'Under 1 month'
    : paybackMonths.toFixed(1) + ' months';
  roiPct.textContent         = Math.round(netROI).toLocaleString() + '%';

  roiSubText.innerHTML = `AutoRise investment of <strong>$10,000</strong> returns <strong>${fmt(savings)}</strong> annually`;

  // Animate ROI bar — cap visual at 100% width but show real %
  const barWidth = Math.min((netROI / 500) * 100, 100);
  setTimeout(() => { roiFill.style.width = barWidth + '%'; }, 100);

  // Show results
  resultsEl.classList.add('visible');
  setTimeout(() => {
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

// ── Reset ──
function reset() {
  form.reset();
  resultsEl.classList.remove('visible');
  roiFill.style.width = '0';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Events ──
form.addEventListener('submit', calculate);
resetBtn.addEventListener('click', reset);

// Auto-format company name on blur (title case)
document.getElementById('companyName').addEventListener('blur', function () {
  this.value = this.value.replace(/\b\w/g, (c) => c.toUpperCase());
});
