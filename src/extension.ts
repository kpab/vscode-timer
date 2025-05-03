import * as vscode from 'vscode';
import { TimeTrackerProvider } from './timeTrackerProvider';
import { TimeCardGenerator } from './timeCardGenerator';
import { FloatingTimer } from './floatingTimer';

let statusBarItem: vscode.StatusBarItem;
let timeTracker: TimeTracker;
let floatingTimer: FloatingTimer | undefined;

export function activate(context: vscode.ExtensionContext) {
    // ステータスバーアイテムの作成
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'timeTracker.openPanel';
    statusBarItem.text = '$(watch) 00:00:00';
    statusBarItem.tooltip = 'Time Tracker: Click to open panel';
    statusBarItem.show();

    // タイムトラッカーの初期化
    timeTracker = new TimeTracker(context, statusBarItem);

    // コマンドの登録
    const toggleCommand = vscode.commands.registerCommand('timeTracker.toggle', () => {
        timeTracker.toggle();
    });

    const openPanelCommand = vscode.commands.registerCommand('timeTracker.openPanel', () => {
        vscode.commands.executeCommand('workbench.view.explorer');
        vscode.commands.executeCommand('timeTrackerView.focus');
    });
    
    const generateTimeCardCommand = vscode.commands.registerCommand('timeTracker.generateTimeCard', () => {
        TimeCardGenerator.generateTimeCard(context, timeTracker);
    });
    
    const showFloatingTimerCommand = vscode.commands.registerCommand('timeTracker.showFloatingTimer', () => {
        if (!floatingTimer) {
            floatingTimer = new FloatingTimer(context, timeTracker);
        } else {
            floatingTimer.show();
        }
    });

    // Time Tracker View Provider
    const timeTrackerProvider = new TimeTrackerProvider(context, timeTracker);
    vscode.window.registerTreeDataProvider('timeTrackerView', timeTrackerProvider);

    // エディタの変更監視
    vscode.window.onDidChangeActiveTextEditor(editor => {
        timeTracker.onEditorChange(editor);
    });

    // 定期的な更新
    const interval = setInterval(() => {
        timeTracker.update();
    }, 60000); // 1分ごと

    context.subscriptions.push(
        statusBarItem,
        toggleCommand,
        openPanelCommand,
        generateTimeCardCommand,
        showFloatingTimerCommand,
        { dispose: () => clearInterval(interval) }
    );
}

export function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}

// TimeTrackerクラス
export class TimeTracker {
    private isTracking: boolean = true;
    private startTime: number;
    private fileTimers: Map<string, FileTimer>;
    private currentFile: string | undefined;
    private context: vscode.ExtensionContext;
    private statusBarItem: vscode.StatusBarItem;

    constructor(context: vscode.ExtensionContext, statusBarItem: vscode.StatusBarItem) {
        this.context = context;
        this.statusBarItem = statusBarItem;
        this.startTime = Date.now();
        this.fileTimers = this.loadFileTimers();
        this.currentFile = vscode.window.activeTextEditor?.document.fileName;
    }

    toggle() {
        this.isTracking = !this.isTracking;
        if (this.isTracking) {
            this.startTime = Date.now();
            this.statusBarItem.text = this.statusBarItem.text.replace('⏸️', '$(watch)');
        } else {
            this.statusBarItem.text = this.statusBarItem.text.replace('$(watch)', '⏸️');
        }
    }

    onEditorChange(editor: vscode.TextEditor | undefined) {
        if (!this.isTracking) return;

        // 現在のファイルの時間を保存
        if (this.currentFile) {
            this.updateCurrentFileTimer();
        }

        // 新しいファイルの開始
        if (editor) {
            this.currentFile = editor.document.fileName;
            if (!this.fileTimers.has(this.currentFile)) {
                this.fileTimers.set(this.currentFile, {
                    totalTime: 0,
                    lastStartTime: Date.now(),
                    isTracking: true
                });
            } else {
                const timer = this.fileTimers.get(this.currentFile)!;
                timer.lastStartTime = Date.now();
                timer.isTracking = true;
            }
        } else {
            this.currentFile = undefined;
        }
    }

    update() {
        if (!this.isTracking || !this.currentFile) return;

        this.updateCurrentFileTimer();
        this.updateStatusBar();
        this.saveFileTimers();
    }

    private updateCurrentFileTimer() {
        if (!this.currentFile) return;

        const timer = this.fileTimers.get(this.currentFile);
        if (timer && timer.isTracking) {
            const elapsed = Date.now() - timer.lastStartTime;
            timer.totalTime += elapsed;
            timer.lastStartTime = Date.now();
        }
    }

    private updateStatusBar() {
        let totalTime = 0;
        let currentFileTime = 0;

        for (const [file, timer] of this.fileTimers) {
            totalTime += timer.totalTime;
            if (file === this.currentFile) {
                currentFileTime = timer.totalTime;
            }
        }

        const totalTimeStr = this.formatTime(totalTime);
        const currentFileTimeStr = this.formatTime(currentFileTime);
        
        this.statusBarItem.text = `$(watch) ${totalTimeStr} | ${currentFileTimeStr}`;
    }

    private formatTime(ms: number): string {
        const minutes = Math.floor(ms / 60000);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
    }

    private loadFileTimers(): Map<string, FileTimer> {
        const saved = this.context.globalState.get<Record<string, FileTimer>>('fileTimers', {});
        return new Map(Object.entries(saved));
    }

    private saveFileTimers() {
        const obj: Record<string, FileTimer> = {};
        for (const [key, value] of this.fileTimers) {
            obj[key] = value;
        }
        this.context.globalState.update('fileTimers', obj);
    }

    getFileTimers(): Map<string, FileTimer> {
        return this.fileTimers;
    }
    
    getIsTracking(): boolean {
        return this.isTracking;
    }
}

interface FileTimer {
    totalTime: number;
    lastStartTime: number;
    isTracking: boolean;
}
