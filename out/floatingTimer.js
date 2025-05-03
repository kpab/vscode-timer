"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatingTimer = void 0;
const vscode = require("vscode");
class FloatingTimer {
    constructor(context, timeTracker) {
        this.viewType = 'timeTrackerFloatingTimer';
        this.isVisible = true;
        this.context = context;
        this.timeTracker = timeTracker;
        this.createPanel();
    }
    createPanel() {
        this.panel = vscode.window.createWebviewPanel(this.viewType, 'Floating Timer', {
            viewColumn: vscode.ViewColumn.Beside,
            preserveFocus: true
        }, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: []
        });
        this.panel.webview.html = this.getWebviewContent();
        // パネルが閉じられたときの処理
        this.panel.onDidDispose(() => {
            this.dispose();
        });
        // メッセージ処理
        this.panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'toggleVisibility':
                    this.toggleVisibility();
                    break;
                case 'toggleTracking':
                    this.timeTracker.toggle();
                    this.updateTimer();
                    break;
            }
        }, undefined, this.context.subscriptions);
        // 定期的な更新
        this.updateInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }
    show() {
        if (!this.panel) {
            this.createPanel();
        }
        else {
            this.panel.reveal();
        }
    }
    hide() {
        if (this.panel) {
            this.panel.dispose();
            this.panel = undefined;
        }
    }
    toggleVisibility() {
        this.isVisible = !this.isVisible;
        this.updateTimer();
    }
    updateTimer() {
        var _a;
        if (!this.panel)
            return;
        const fileTimers = this.timeTracker.getFileTimers();
        let totalTime = 0;
        let currentFileTime = 0;
        const currentFile = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.fileName;
        for (const [filePath, timer] of fileTimers) {
            totalTime += timer.totalTime;
            if (filePath === currentFile) {
                currentFileTime = timer.totalTime;
            }
        }
        const totalHours = Math.floor(totalTime / 3600000);
        const totalMinutes = Math.floor((totalTime % 3600000) / 60000);
        const totalSeconds = Math.floor((totalTime % 60000) / 1000);
        const currentHours = Math.floor(currentFileTime / 3600000);
        const currentMinutes = Math.floor((currentFileTime % 3600000) / 60000);
        const currentSeconds = Math.floor((currentFileTime % 60000) / 1000);
        this.panel.webview.postMessage({
            command: 'updateTime',
            totalTime: `${totalHours.toString().padStart(2, '0')}:${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`,
            currentTime: `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')}`,
            isTracking: this.timeTracker.getIsTracking(),
            isVisible: this.isVisible
        });
    }
    dispose() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.panel) {
            this.panel.dispose();
        }
    }
    getWebviewContent() {
        return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Floating Timer</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background: transparent;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .timer-container {
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            border-radius: 10px;
            padding: 15px 20px;
            color: white;
            min-width: 200px;
            text-align: center;
            transition: all 0.3s ease;
        }
        .timer-container.hidden {
            opacity: 0.3;
            transform: scale(0.9);
        }
        .timer-label {
            font-size: 12px;
            color: #aaa;
            margin-bottom: 4px;
        }
        .timer-value {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .current-file {
            font-size: 14px;
            color: #fff;
            margin-bottom: 8px;
        }
        .controls {
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        .control-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 5px;
            color: white;
            padding: 5px 10px;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        .control-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        .control-btn.active {
            background: #4CAF50;
        }
    </style>
</head>
<body>
    <div class="timer-container" id="timerContainer">
        <div class="timer-label">Total Time</div>
        <div class="timer-value" id="totalTime">00:00:00</div>
        <div class="timer-label">Current File</div>
        <div class="timer-value" id="currentTime">00:00:00</div>
        <div class="controls">
            <button class="control-btn" id="toggleBtn">⏸️ Pause</button>
            <button class="control-btn" id="visibilityBtn">👁️ Hide</button>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const container = document.getElementById('timerContainer');
        const toggleBtn = document.getElementById('toggleBtn');
        const visibilityBtn = document.getElementById('visibilityBtn');
        const totalTimeDisplay = document.getElementById('totalTime');
        const currentTimeDisplay = document.getElementById('currentTime');

        toggleBtn.addEventListener('click', () => {
            vscode.postMessage({ command: 'toggleTracking' });
        });

        visibilityBtn.addEventListener('click', () => {
            vscode.postMessage({ command: 'toggleVisibility' });
        });

        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'updateTime':
                    totalTimeDisplay.textContent = message.totalTime;
                    currentTimeDisplay.textContent = message.currentTime;
                    
                    if (message.isTracking) {
                        toggleBtn.textContent = '⏸️ Pause';
                        toggleBtn.classList.add('active');
                    } else {
                        toggleBtn.textContent = '▶️ Resume';
                        toggleBtn.classList.remove('active');
                    }
                    
                    if (message.isVisible) {
                        container.classList.remove('hidden');
                        visibilityBtn.textContent = '👁️ Hide';
                    } else {
                        container.classList.add('hidden');
                        visibilityBtn.textContent = '👁️ Show';
                    }
                    break;
            }
        });
    </script>
</body>
</html>`;
    }
}
exports.FloatingTimer = FloatingTimer;
//# sourceMappingURL=floatingTimer.js.map