import { APP } from './utils.js';
const ZONES = Object.freeze({ 1:[33,129.5],2:[33,131],3:[36,132+10/60],4:[33,133.5],5:[36,134+20/60],6:[36,136],7:[36,137+10/60],8:[36,138.5],9:[36,139+50/60],10:[40,140+50/60],11:[44,140+15/60],12:[44,142+15/60],13:[44,144+15/60],14:[26,142],15:[26,127.5],16:[26,124],17:[26,131],18:[20,136],19:[26,154] });
export class GpsService {
  constructor() { this.watchId = null; this.last = null; this.zone = 1; }
  get active() { return this.watchId !== null; }
  setZone(zone) { this.zone = Number(zone) || 1; }
  projectionDefinition() { const [lat0, lon0] = ZONES[this.zone] || ZONES[1]; return `+proj=tmerc +lat_0=${lat0} +lon_0=${lon0} +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs`; }
  toPlane(lat, lon) { if (!globalThis.proj4) throw new Error('Proj4jsが読み込まれていません'); const [east, north] = globalThis.proj4('EPSG:4326', this.projectionDefinition(), [lon, lat]); return { X: north, Y: east }; }
  toWgs84(X, Y) { if (!globalThis.proj4) throw new Error('Proj4jsが読み込まれていません'); const [lon, lat] = globalThis.proj4(this.projectionDefinition(), 'EPSG:4326', [Y, X]); return { lat, lon }; }
  start(onUpdate, onError) { if (!('geolocation' in navigator)) { onError('このブラウザではGPSを使用できません'); return false; } this.stop(); this.watchId = navigator.geolocation.watchPosition((p) => this.handlePosition(p, onUpdate, onError), (e) => onError(this.errorMessage(e)), { enableHighAccuracy: true, maximumAge: APP.gpsMaximumAgeMs, timeout: APP.gpsTimeoutMs }); return true; }
  handlePosition(position, onUpdate, onError) { try { const { latitude, longitude, accuracy } = position.coords; const plane = this.toPlane(latitude, longitude); this.last = { lat: latitude, lon: longitude, accuracy, time: new Date(position.timestamp).toISOString(), X: plane.X, Y: plane.Y }; onUpdate(this.last); } catch (error) { onError(error.message || 'GPS座標変換に失敗しました'); } }
  errorMessage(error) { switch (error.code) { case error.PERMISSION_DENIED: return 'GPS利用が拒否されました'; case error.POSITION_UNAVAILABLE: return 'GPS位置情報を取得できません'; case error.TIMEOUT: return 'GPS取得がタイムアウトしました'; default: return 'GPS取得に失敗しました'; } }
  stop() { if (this.watchId !== null) navigator.geolocation.clearWatch(this.watchId); this.watchId = null; }
}
