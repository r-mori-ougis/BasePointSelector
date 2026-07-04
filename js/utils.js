export const APP = Object.freeze({ dbName: 'BasePointSelectorDB', dbVersion: 3, autosaveKey: 'last-project', minScale: 0.02, maxScale: 40, doubleTapMs: 320, tapMovePx: 8, hitRadiusPx: 24, pdfMaxSidePx: 4096, toastMs: 2600, gpsTimeoutMs: 15000, gpsMaximumAgeMs: 0, candidatePrefix: 'BP', candidateDigits: 3 });
export const $ = (id) => document.getElementById(id);
export function fmt(value, digits = 3) { if (value === null || value === undefined || !Number.isFinite(Number(value))) return '-'; return Number(value).toLocaleString('ja-JP', { maximumFractionDigits: digits }); }
export function parseNumber(value, label) { const n = Number.parseFloat(value); if (!Number.isFinite(n)) throw new Error(`${label}を入力してください`); return n; }
export function nowIso() { return new Date().toISOString(); }
export function uuid() { if (crypto && crypto.randomUUID) return crypto.randomUUID(); return `${Date.now()}-${Math.random().toString(16).slice(2)}`; }
export function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
export function circled(index) { return ['①','②','③','④'][index - 1] || String(index); }
export function readFileAsArrayBuffer(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('ファイル読込に失敗しました')); reader.readAsArrayBuffer(file); }); }
export function readFileAsDataUrl(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('写真読込に失敗しました')); reader.readAsDataURL(file); }); }
export function downloadJson(filename, data) { const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
export function isVisible(point, width, height) { return point.x >= 0 && point.y >= 0 && point.x <= width && point.y <= height; }
