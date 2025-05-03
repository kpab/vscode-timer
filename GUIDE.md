# Time Tracker Operation Guide | Time Tracker 操作ガイド

## Table of Contents | 目次

1. [Getting Started | はじめに](#getting-started)
2. [Main Features | 主な機能](#main-features)
3. [Detailed Instructions | 詳細な操作説明](#detailed-instructions)
4. [Tips & Tricks | ヒントとコツ](#tips-and-tricks)
5. [Troubleshooting | トラブルシューティング](#troubleshooting)

## Getting Started | はじめに

### Installation | インストール

1. Open VSCode marketplace
2. Search for "Time Tracker"
3. Click Install
4. Restart VSCode if prompted

1. VSCode マーケットプレイスを開く
2. "Time Tracker" を検索
3. インストールをクリック
4. 必要に応じてVSCodeを再起動

### Initial Setup | 初期設定

No configuration is required! Time Tracker works immediately after installation.

設定は不要です！インストール後すぐに使用できます。

## Main Features | 主な機能

### 1. Automatic Tracking | 自動計測

Time Tracker automatically starts measuring time when you:
- Open a file
- Switch between files
- Resume work on a file

Time Tracker は以下の際に自動的に時間計測を開始します：
- ファイルを開く
- ファイルを切り替える
- ファイルの作業を再開する

### 2. Status Bar Display | ステータスバー表示

**Location**: Bottom right of VSCode
**Display Format**: `⌚ HH:MM | HH:MM`
- Left value: Total time
- Right value: Current file time

**場所**: VSCode の右下
**表示形式**: `⌚ HH:MM | HH:MM`
- 左の値：合計時間
- 右の値：現在のファイルの時間

### 3. Time Tracker Panel | Time Tracker パネル

**Access**: Click status bar timer OR View → Explorer → Time Tracker

**Features**:
- View time per file
- See total project time
- Generate time cards
- Show floating timer
- Reset all data

**アクセス**: ステータスバーのタイマーをクリック または 表示 → エクスプローラー → Time Tracker

**機能**:
- ファイルごとの時間表示
- プロジェクト合計時間の確認
- タイムカードの生成
- フローティングタイマーの表示
- 全データのリセット

### 4. Time Cards | タイムカード

Beautiful visual representations of your work time:

**Features**:
- Gradient backgrounds
- File time breakdown
- Percentage visualization
- Export as HTML

作業時間の美しいビジュアライゼーション：

**機能**:
- グラデーション背景
- ファイル別時間内訳
- パーセンテージの可視化
- HTMLエクスポート

### 5. Floating Timer | フローティングタイマー

A movable panel showing real-time tracking:

**Controls**:
- 🗑️ Moved to any screen position
- ⏸️ Pause/Resume
- 👁️ Show/Hide

実時間の追跡を表示する移動可能なパネル：

**コントロール**:
- 🗑️ 画面上の任意の位置に移動
- ⏸️ 一時停止/再開
- 👁️ 表示/非表示

### 6. File Exclusion | ファイル除外

Exclude specific files from tracking:

**Status Indicator**:
- 👁️ Tracked (normal color)
- 👁️‍🗨️ Excluded (warning color)

特定のファイルを計測から除外：

**ステータス表示**:
- 👁️ 計測対象（通常色）
- 👁️‍🗨️ 除外済み（警告色）

## Detailed Instructions | 詳細な操作説明

### Starting Time Tracking | 時間計測の開始

1. **Automatic Start**: Opens any file
2. **Manual Control**: Use command palette `Time Tracker: Toggle`

1. **自動開始**: ファイルを開く
2. **手動制御**: コマンドパレットで `Time Tracker: Toggle`

### Generating Time Cards | タイムカードの生成

1. Click preview icon (📋) in Time Tracker panel
2. View the generated time card in webview
3. Save the HTML file when prompted

1. Time Tracker パネルのプレビューアイコン（📋）をクリック
2. webviewで生成されたタイムカードを確認
3. 促されたらHTMLファイルを保存

### Using Floating Timer | フローティングタイマーの使用

1. Click floating timer icon (🔄) in Time Tracker panel
2. Drag panel to desired position
3. Use controls:
   - ⏸️ Pause counting
   - 👁️ Minimize panel

1. Time Tracker パネルのフローティングタイマーアイコン（🔄）をクリック
2. パネルを希望の位置にドラッグ
3. コントロールを使用：
   - ⏸️ カウントを一時停止
   - 👁️ パネルを最小化

### Managing File Exclusions | ファイル除外の管理

1. **Current File**: Click eye icon in status bar
2. **Manage All**: Choose "Manage excluded files" option
3. **Toggle**: Select/deselect files from list

1. **現在のファイル**: ステータスバーの目アイコンをクリック
2. **全管理**: "除外ファイルを管理"オプションを選択
3. **切り替え**: リストからファイルを選択/解除

### Resetting Time Data | 時間データのリセット

1. Click reset icon (🔄) in Time Tracker panel
2. Confirm action in the warning dialog
3. All time data is cleared

1. Time Tracker パネルのリセットアイコン（🔄）をクリック
2. 警告ダイアログで操作を確認
3. すべての時間データがクリア

## Tips & Tricks | ヒントとコツ

### Best Practices | ベストプラクティス

1. **Regular Checks**: Review time data periodically
2. **Use Exclusions**: Exclude non-work files
3. **Generate Cards**: Create weekly/monthly reports
4. **Pause Feature**: Use during breaks

1. **定期確認**: 時間データを定期的に確認
2. **除外機能の活用**: 作業以外のファイルを除外
3. **カード生成**: 週次/月次レポートを作成
4. **一時停止機能**: 休憩中に使用

### Keyboard Efficiency | キーボード効率化

- Use Command Palette (Cmd/Ctrl+Shift+P) for all commands
- Quick access: Search "Time Tracker"

- コマンドパレット（Cmd/Ctrl+Shift+P）で全コマンドを使用
- クイックアクセス：「Time Tracker」を検索

### Workflow Integration | ワークフロー統合

1. **Morning Start**: Check previous day's time
2. **Focus Mode**: Use floating timer
3. **End of Day**: Generate time card

1. **朝の開始**: 前日の時間を確認
2. **集中モード**: フローティングタイマーを使用
3. **終業時**: タイムカードを生成

## Troubleshooting | トラブルシューティング

### Common Issues | よくある問題

#### Time not updating | 時間が更新されない
**Solution**: Ensure file is not excluded
**解決策**: ファイルが除外されていないか確認

#### Floating timer hidden | フローティングタイマーが非表示
**Solution**: Click show button or restart extension
**解決策**: 表示ボタンをクリックまたは拡張機能を再起動

#### Data lost | データが失われた
**Solution**: Data persists per workspace. Check correct workspace.
**解決策**: データはワークスペースごとに保持。正しいワークスペースを確認

### Support | サポート

For additional help:
1. Check GitHub Issues
2. Submit new issue with:
   - VSCode version
   - Extension version
   - Steps to reproduce

追加のヘルプ：
1. GitHub Issuesを確認
2. 新しい問題を以下の情報と共に報告：
   - VSCode バージョン
   - 拡張機能バージョン
   - 再現手順

## Version History | バージョン履歴

See CHANGELOG.md for detailed version information.

詳細なバージョン情報は CHANGELOG.md を参照してください。

---

Thank you for using Time Tracker! | Time Tracker をご利用いただきありがとうございます！

For feedback or suggestions, please contact us through GitHub.
フィードバックや提案は、GitHub経由でお問い合わせください。
