import { $, APP } from './utils.js';
export class UIController {
  constructor() { this.toastTimer = 0; }
  init() { document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => this.closeNearest(b))); this.populateZones(); }
  populateZones() { const select = $('prjZone'); select.innerHTML = ''; for (let zone = 1; zone <= 19; zone += 1) { const option = document.createElement('option'); option.value = String(zone); option.textContent = `${zone}系`; if (zone === 1) option.selected = true; select.appendChild(option); } }
  toast(message, duration = APP.toastMs) { const el = $('toast'); el.textContent = message; el.hidden = false; clearTimeout(this.toastTimer); this.toastTimer = window.setTimeout(() => { el.hidden = true; }, duration); }
  showError(message) { this.toast(message, 5000); window.alert(message); }
  openDialog(id) { $(id).hidden = false; }
  closeDialog(id) { $(id).hidden = true; }
  closeNearest(element) { const overlay = element.closest('.overlay'); if (overlay) overlay.hidden = true; }
  showTapBanner(message) { $('tapBannerMsg').textContent = message; $('tapBanner').hidden = false; }
  hideTapBanner() { $('tapBanner').hidden = true; }
  setZoom(scale) { $('stZoom').textContent = `${Math.round(scale * 100)}%`; }
  setGps(gps) { $('stAcc').textContent = gps ? `${Math.round(gps.accuracy)}m` : '-'; $('stX').textContent = gps ? gps.X.toFixed(3) : '-'; $('stY').textContent = gps ? gps.Y.toFixed(3) : '-'; }
  setRmse(rmse) { $('stRmse').textContent = Number.isFinite(rmse) ? `${rmse.toFixed(3)}m` : '-'; }
}
