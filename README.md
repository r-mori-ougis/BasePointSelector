# 基準点選点支援システム Ver.1.0

iPhone Safari 上で動作する、地籍調査の基準点選点に特化したローカル動作GISビューアです。
サーバー不要・完全ローカル動作（PWA対応）。

## 機能（Ver.1.0）

1. PDF・画像（JPG/PNG）の読込と表示（PDF.js）
2. ピンチズーム・パン・ダブルタップ拡大（回転禁止）
3. 2〜4点標定（2点：ヘルマート変換／3点以上：アフィン変換＋最小二乗法、残差・RMSE表示）
4. GPS現在地のリアルタイム表示（Proj4js による平面直角座標系 第1〜19系 変換、精度円表示）
5. 候補点登録（番号 BP001〜・座標・日時・GPS精度・メモ・写真撮影）
6. プロジェクト保存・再読込（IndexedDB）、JSONエクスポート／インポート

## 使い方

1. 「読込」→ PDF または JPG/PNG の図面を開く
2. 「プロジェクト」→ 案件名・地区名・平面直角座標系（第1〜19系）を設定
3. 「標定」→「＋点を追加」→ 図面上の既知点をタップ → X（北）・Y（東）座標を入力（2点以上、推奨3〜4点）
4. 「GPS」→ 現在地が図面上に青●で表示される
5. 「候補登録」→ GPS座標がプリセットされた登録画面で番号・メモ・写真を付けて登録（図面上に ○BP001 と表示）
6. 「保存」→ IndexedDBへ保存。起動時に前回プロジェクトを自動復元

図面上の候補点マーカーをタップすると詳細（写真・メモ編集・削除）を表示します。

## 配置（重要）

GPS（Geolocation API）と Service Worker は **HTTPS 環境が必須** です（file:// では動作しません）。
GitHub Pages・Netlify 等の静的ホスティング、または社内 HTTPS サーバーへフォルダごと配置してください。

動作確認用のローカルサーバー例:

```
cd BasePointSelector
python3 -m http.server 8000
# → http://localhost:8000 （localhostは例外的にGPS・SW可）
```

iPhone では Safari で開き「ホーム画面に追加」するとフルスクリーンのアプリとして動作します。

## 座標系について

- X＝北方向、Y＝東方向（測量系）
- GPS の WGS84 座標は JGD2011 平面直角座標系（第1〜19系）へ変換されます（数cmの系差は無視）

## フォルダ構成

```
BasePointSelector/
├── index.html
├── manifest.json
├── sw.js
├── css/ (style.css, viewer.css, dialog.css)
├── js/  (app, viewer, calibration, transform, gps, storage,
│         project, candidate, photo, ui, utils)
├── lib/ (pdf.min.js, pdf.worker.min.js, proj4.js)
├── icons/
└── data/
```

## 将来拡張（設計書 §16）

SIMA/LAS重ね表示、国土地理院地図、GPX/CSV出力、Bluetooth GNSS受信機、オフライン地図キャッシュ等。
