import * as vscode from 'vscode';
import * as path from 'path';

interface FileTimer {
    totalTime: number;
    lastStartTime: number;
    isTracking: boolean;
}

export class TimeTrackerProvider implements vscode.TreeDataProvider<TimeTrackerItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TimeTrackerItem | undefined | void> = new vscode.EventEmitter<TimeTrackerItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TimeTrackerItem | undefined | void> = this._onDidChangeTreeData.event;

    constructor(private context: vscode.ExtensionContext, private timeTracker: any) {
        setInterval(() => {
            this.refresh();
        }, 60000);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TimeTrackerItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TimeTrackerItem): Thenable<TimeTrackerItem[]> {
        if (!element) {
            // ルートレベル
            const items: TimeTrackerItem[] = [];
            
            // 合計時間
            const totalItem = new TimeTrackerItem(
                'Total Time',
                '',
                'stopwatch',
                vscode.TreeItemCollapsibleState.None
            );
            items.push(totalItem);

            // プロジェクトフォルダ
            const projectItem = new TimeTrackerItem(
                'Active Files',
                '',
                'folder',
                vscode.TreeItemCollapsibleState.Expanded
            );
            items.push(projectItem);

            return Promise.resolve(items);
        } else if (element.label === 'Active Files') {
            // ファイルリスト
            const fileTimers = this.timeTracker.getFileTimers();
            const items: TimeTrackerItem[] = [];

            for (const [filePath, timer] of fileTimers) {
                const fileName = path.basename(filePath);
                const timeStr = this.formatTime(timer.totalTime);
                const description = timeStr;
                const iconName = this.getFileIcon(filePath);

                const item = new TimeTrackerItem(
                    fileName,
                    description,
                    iconName,
                    vscode.TreeItemCollapsibleState.None
                );
                
                item.tooltip = `${filePath}\nTotal time: ${timeStr}`;
                item.contextValue = 'fileItem';
                items.push(item);
            }

            return Promise.resolve(items);
        }

        return Promise.resolve([]);
    }

    private formatTime(ms: number): string {
        const minutes = Math.floor(ms / 60000);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    }

    private getFileIcon(filePath: string): string {
        const ext = path.extname(filePath).toLowerCase();
        
        const iconMap: { [key: string]: string } = {
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

class TimeTrackerItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly description: string,
        iconName: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label}: ${this.description}`;
        this.description = description;
        
        if (this.label !== 'Total Time' && this.label !== 'Active Files') {
            this.iconPath = new vscode.ThemeIcon(iconName);
        } else {
            this.iconPath = new vscode.ThemeIcon(iconName);
        }
    }
}
