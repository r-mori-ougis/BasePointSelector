import { $, readFileAsArrayBuffer } from './utils.js';
import { UIController } from './ui.js';
import { TransformService } from './transform.js';
import { StorageService } from './storage.js';
import { PhotoService } from './photo.js';
import { GpsService } from './gps.js';
import { Viewer } from './viewer.js';
import { CalibrationController } from './calibration.js';
import { CandidateController } from './candidate.js';
import { ProjectController } from './project.js';

class App {
  constructor() {
    this.ui = new UIController();
    this.transform = new TransformService();
    this.storage = new StorageService();
    this.photo = new PhotoService();
    this.gps = new GpsService();
    this.calibration = new CalibrationController(this.ui, this.transform);
    this.candidates = new CandidateController(this.ui, this.gps, this.transform, this.photo);
    this.viewer = new Viewer(this.ui, this.transform, this.gps, this.calibration, this.candidates);
    this.project = new ProjectController(this.ui, this.storage, this.viewer, this.calibration, this.candidates, this.transform, this.gps);
    this.calibration.attachViewer(this.viewer);
    this.candidates.attachViewer(this.viewer);
  }

  async init() {
    if (globalThis.pdfjsLib) globalThis.pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.min.js';
    this.ui.init();
    this.viewer.init();
    this.bindEvents();
    try {
      await this.storage.open();
      await this.project.loadLast();
      await this.project.renderList();
    } catch (error) {
      console.error(error);
      this.ui.toast('保存領域を開けません。プライベートブラウズでは保存できない場合があります');
    }
    this.registerServiceWorker();
  }

  bindEvents() {
    const fileInput = $('fileInput');
    $('btnLoad').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async () => this.loadSelectedFile(fileInput));
    $('btnSave').addEventListener('click', () => this.project.save());
    $('btnProject').addEventListener('click', async () => { await this.project.renderList(); this.ui.openDialog('dlgProject'); });
    $('btnCalib').addEventListener('click', () => this.calibration.open());
    $('btnGps').addEventListener('click', () => this.toggleGps());
    $('btnCandidate').addEventListener('click', () => this.candidates.openRegister());
    $('tapCancel').addEventListener('click', () => { this.viewer.tapHandler = null; this.ui.hideTapBanner(); });
    $('prjNew').addEventListener('click', () => this.project.newProject());
    $('prjExport').addEventListener('click', () => this.project.exportJSON());
    $('prjImportBtn').addEventListener('click', () => $('prjImportFile').click());
    $('prjImportFile').addEventListener('change', (e) => { const file = e.target.files && e.target.files[0]; e.target.value = ''; if (file) this.project.importJSON(file); });
    $('prjZone').addEventListener('change', (e) => { this.gps.setZone(e.target.value); this.gps.last = null; this.ui.setGps(null); });
    $('calibAdd').addEventListener('click', () => this.calibration.startAdd());
    $('calibCompute').addEventListener('click', () => { if (this.calibration.compute()) { this.calibration.renderList(); this.ui.toast('標定計算が完了しました'); } });
    $('calibClear').addEventListener('click', () => this.calibration.clearAll());
    $('calibCoordOk').addEventListener('click', () => this.calibration.confirmCoord());
    $('candPhoto').addEventListener('change', (e) => this.candidates.onPhotoSelected(e.target));
    $('candOk').addEventListener('click', () => this.candidates.confirmRegister());
    $('cdSave').addEventListener('click', () => this.candidates.saveDetail());
    $('cdDelete').addEventListener('click', () => this.candidates.deleteDetail());
  }

  async loadSelectedFile(input) {
    const file = input.files && input.files[0];
    input.value = '';
    if (!file) return;
    try {
      this.ui.toast('読み込み中...', 60000);
      await this.project.setDrawing(file);
      this.ui.toast(`${file.name}を読み込みました`);
    } catch (error) {
      console.error(error);
      this.ui.toast(error.message || 'ファイル読込に失敗しました');
    }
  }

  toggleGps() {
    const button = $('btnGps');
    if (this.gps.active) {
      this.gps.stop();
      button.classList.remove('active');
      this.ui.setGps(null);
      this.viewer.requestRender();
      return;
    }
    const started = this.gps.start(
      (gps) => { this.ui.setGps(gps); this.viewer.requestRender(); },
      (message) => { this.ui.toast(message); this.gps.stop(); button.classList.remove('active'); this.ui.setGps(null); }
    );
    if (started) {
      button.classList.add('active');
      if (!this.transform.params) this.ui.toast('標定後に現在地が図面上へ表示されます');
    }
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('sw.js').catch((error) => console.warn('Service Worker登録失敗', error));
    }
  }
}

window.addEventListener('load', () => { const app = new App(); app.init(); });
