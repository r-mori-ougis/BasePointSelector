import { readFileAsDataUrl } from './utils.js';
export class PhotoService { async fileToDataUrl(file) { if (!file) return null; return readFileAsDataUrl(file); } }
