"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeTrackerProvider = void 0;
const vscode = require("vscode");
const path = require("path");
class TimeTrackerProvider {
    constructor(context, timeTracker) {
        this.context = context;
        this.timeTracker = timeTracker;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        setInterval(() => {
            this.refresh();
        }, 60000);
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            // ルートレベル
            const items = [];
            // 合計時間
            const totalItem = new TimeTrackerItem('Total Time', '', 'stopwatch', vscode.TreeItemCollapsibleState.None);
            items.push(totalItem);
            // プロジェクトフォルダ
            const projectItem = new TimeTrackerItem('Active Files', '', 'folder', vscode.TreeItemCollapsibleState.Expanded);
            items.push(projectItem);
            return Promise.resolve(items);
        }
        else if (element.label === 'Active Files') {
            // ファイルリスト
            const fileTimers = this.timeTracker.getFileTimers();
            const items = [];
            for (const [filePath, timer] of fileTimers) {
                const fileName = path.basename(filePath);
                const timeStr = this.formatTime(timer.totalTime);
                const description = timeStr;
                const iconName = this.getFileIcon(filePath);
                const item = new TimeTrackerItem(fileName, description, iconName, vscode.TreeItemCollapsibleState.None);
                item.tooltip = `${filePath}\nTotal time: ${timeStr}`;
                item.contextValue = 'fileItem';
                items.push(item);
            }
            return Promise.resolve(items);
        }
        return Promise.resolve([]);
    }
    formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    }
    getFileIcon(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const iconMap = {
            '.js': 'file-javascript',
            '.ts': 'file-typescript',
            '.html': 'file-html',
            '.css': 'file-css',
            '.md': 'file-markdown',
            '.json': 'file-json',
            '.txt': 'file-text',
            '.png': 'file-image',
            '.jpg': 'file-image',
            '.jpeg': 'file-image'
        };
        return iconMap[ext] || 'file';
    }
}
exports.TimeTrackerProvider = TimeTrackerProvider;
class TimeTrackerItem extends vscode.TreeItem {
    constructor(label, description, iconName, collapsibleState) {
        super(label, collapsibleState);
        this.label = label;
        this.description = description;
        this.collapsibleState = collapsibleState;
        this.tooltip = `${this.label}: ${this.description}`;
        this.description = description;
        if (this.label !== 'Total Time' && this.label !== 'Active Files') {
            this.iconPath = new vscode.ThemeIcon(iconName);
        }
        else {
            this.iconPath = new vscode.ThemeIcon(iconName);
        }
    }
}
//# sourceMappingURL=timeTrackerProvider.js.map