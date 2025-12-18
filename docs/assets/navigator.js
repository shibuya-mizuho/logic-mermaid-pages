class FunctionNavigator {
    constructor(functionsData) {
        this.functions = functionsData;
        this.currentFunction = null;
        this.navigationHistory = []; // {functionName, scrollTop, zoomLevel}の配列
        this.zoomLevel = 1;
        this.buildFunctionList();
        this.setupEventListeners();
        this.checkInitialHash();
    }

    checkInitialHash() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const functionName = decodeURIComponent(hash);
            if (this.functions[functionName]) {
                this.showFunction(functionName, false, false);
            }
        }
    }
    
    buildFunctionList() {
        const listContainer = document.getElementById('function-list');
        const functions = Object.keys(this.functions).sort();
        
        // パッケージごとにグループ化
        const packageGroups = {};
        functions.forEach(funcName => {
            const func = this.functions[funcName];
            const packageName = func.packageName;
            if (!packageGroups[packageName]) {
                packageGroups[packageName] = [];
            }
            packageGroups[packageName].push(func);
        });
        
        // HTML生成
        let html = '';
        Object.keys(packageGroups).sort().forEach(packageName => {
            html += '<div class="package-group mb-3">';
            html += '<h6 class="package-title">' + packageName + '</h6>';
            html += '<div class="function-items">';
            
            packageGroups[packageName].forEach(func => {
                const displayName = func.receiverType ? 
                    func.receiverType + '.' + func.functionName : 
                    func.functionName;
                
                html += '<div class="function-item" data-function="' + func.fullName + '">';
                html += '<span class="function-name">' + displayName + '</span>';
                if (func.comments) {
                    html += '<small class="function-comment text-muted d-block">' + 
                           func.comments.substring(0, 50) + 
                           (func.comments.length > 50 ? '...' : '') + '</small>';
                }
                html += '</div>';
            });
            
            html += '</div></div>';
        });
        
        listContainer.innerHTML = html;
    }
    
    setupEventListeners() {
        // 関数クリックイベント
        document.addEventListener('click', (e) => {
            if (e.target.closest('.function-item')) {
                const functionName = e.target.closest('.function-item').dataset.function;
                this.showFunction(functionName);
            }
        });
        
        // 検索機能
        document.getElementById('function-search').addEventListener('input', (e) => {
            this.filterFunctions(e.target.value);
        });

        // URLハッシュ変更の監視
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });
        
        // Backspaceキーで戻る機能
        document.addEventListener('keydown', (e) => {
            // 検索フィールドにフォーカスがある場合は無視
            if (e.target.id === 'function-search') {
                return;
            }
            
            if (e.key === 'Backspace' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                this.goBack();
            }
        });
    }

    handleHashChange() {
        const hash = window.location.hash.substring(1);
        const functionName = decodeURIComponent(hash);
        
        // 現在表示中の関数と同じ場合は何もしない
        if (functionName === this.currentFunction) {
            return;
        }

        if (functionName && this.functions[functionName]) {
            this.showFunction(functionName, false, false);
        } else if (!functionName) {
            this.showWelcome();
        }
    }
    
    filterFunctions(searchTerm) {
        const items = document.querySelectorAll('.function-item');
        const term = searchTerm.toLowerCase();
        
        items.forEach(item => {
            const functionName = item.querySelector('.function-name').textContent.toLowerCase();
            const comment = item.querySelector('.function-comment');
            const commentText = comment ? comment.textContent.toLowerCase() : '';
            
            if (functionName.includes(term) || commentText.includes(term)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    showFunction(functionName, restoreScrollPosition = false, updateHash = true) {
        const func = this.functions[functionName];
        if (!func) return;

        // URLハッシュを更新
        if (updateHash && window.location.hash !== '#' + functionName) {
            window.location.hash = functionName;
        }
        
        // 現在の状態を履歴に保存（新しい関数に移動する場合のみ）
        if (!restoreScrollPosition && this.currentFunction && this.currentFunction !== functionName) {
            this.saveCurrentState();
        }
        
        this.currentFunction = functionName;
        
        // 履歴に追加（復元時は追加しない）
        if (!restoreScrollPosition) {
            this.navigationHistory.push({
                functionName: functionName,
                scrollTop: 0,
                zoomLevel: this.zoomLevel
            });
        }
        
        // UI要素を表示
        document.getElementById('welcome-message').style.display = 'none';
        document.getElementById('function-info').style.display = 'block';
        document.getElementById('mermaid-container').style.display = 'block';
        document.getElementById('call-relationships').style.display = 'block';
        
        // 関数情報を更新
        this.updateFunctionInfo(func);
        
        // Mermaid図を表示
        this.renderMermaidDiagram(func.mermaidCode);
        
        // 呼び出し関係を更新
        this.updateCallRelationships(func);
        
        // パンくずナビゲーションを更新
        this.updateBreadcrumb(func);
        
        // アクティブ状態を更新
        this.updateActiveFunction(functionName);
    }
    
    updateFunctionInfo(func) {
        document.getElementById('function-title').textContent = 
            (func.receiverType ? func.receiverType + '.' : '') + func.functionName;
        document.getElementById('function-description').textContent = func.comments || '説明なし';
        document.getElementById('function-package').textContent = func.packageName;
        document.getElementById('function-file').textContent = func.fileName;
    }
    
    async renderMermaidDiagram(mermaidCode) {
        const diagramElement = document.getElementById('mermaid-diagram');
        
        try {
            // 既存の図をクリア
            diagramElement.innerHTML = '';
            
            // Mermaidが初期化されているかチェック
            if (typeof mermaid === 'undefined') {
                throw new Error('Mermaid library is not loaded');
            }
            
            // 新しい図をレンダリング（Mermaid v10の新しいAPI）
            const diagramId = 'diagram-' + Date.now();
            
            // renderAsync を使用（v10の推奨方法）
            const { svg } = await mermaid.render(diagramId, mermaidCode);
            diagramElement.innerHTML = svg;
            
            console.log('Mermaid diagram rendered successfully');
            
            // SVG内の関数呼び出しにクリックイベントを追加
            this.addClickEventsToSVG(diagramElement);
            
            // ズーム機能を適用
            this.applyZoom();
            
        } catch (error) {
            console.error('Mermaid rendering error:', error);
            diagramElement.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <h6>フローチャートの表示エラー</h6>
                    <p>Mermaid図の生成中にエラーが発生しました。</p>
                    <small>エラー詳細: ${error.message}</small>
                </div>
            `;
        }
    }
    
    addClickEventsToSVG(container) {
        // SVG内のテキスト要素で関数名を検出してクリック可能にする
        const textElements = container.querySelectorAll('text');
        textElements.forEach(text => {
            const content = text.textContent.trim();
            
            // 関数呼び出しパターンを検出
            Object.keys(this.functions).forEach(funcName => {
                const func = this.functions[funcName];
                const patterns = [
                    func.functionName,
                    func.receiverType + '.' + func.functionName,
                    func.fullName
                ];
                
                if (patterns.some(pattern => content.includes(pattern))) {
                    text.style.cursor = 'pointer';
                    text.style.fill = '#007bff';
                    text.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.showFunction(funcName);
                    });
                }
            });
        });
    }
    
    updateCallRelationships(func) {
        // 呼び出し先
        const calleesList = document.getElementById('callees-list');
        if (func.calledFunctions && func.calledFunctions.length > 0) {
            calleesList.innerHTML = func.calledFunctions.map(calledFunc => 
                '<li><a href="#" onclick="window.functionNavigator.showFunctionByCall(\'' + calledFunc + '\'); return false;">' + 
                calledFunc + '</a></li>'
            ).join('');
        } else {
            calleesList.innerHTML = '<li class="text-muted">なし</li>';
        }
        
        // 呼び出し元（簡易実装）
        const callersList = document.getElementById('callers-list');
        const callers = this.findCallers(func.fullName);
        if (callers.length > 0) {
            callersList.innerHTML = callers.map(caller => 
                '<li><a href="#" onclick="window.functionNavigator.showFunction(\'' + caller + '\'); return false;">' + 
                caller + '</a></li>'
            ).join('');
        } else {
            callersList.innerHTML = '<li class="text-muted">なし</li>';
        }
    }
    
    findCallers(targetFunction) {
        const callers = [];
        const targetFunc = this.functions[targetFunction];
        if (!targetFunc) return callers;
        
        // 検索対象の関数名パターンを作成
        const searchPatterns = [
            targetFunc.functionName,
            targetFunc.receiverType ? targetFunc.receiverType + '.' + targetFunc.functionName : null,
            targetFunc.fullName
        ].filter(pattern => pattern);
        
        Object.keys(this.functions).forEach(funcName => {
            const func = this.functions[funcName];
            if (func.calledFunctions && func.calledFunctions.length > 0) {
                // より正確なマッチング
                const hasMatch = func.calledFunctions.some(calledFunc => {
                    return searchPatterns.some(pattern => {
                        return calledFunc === pattern || 
                               calledFunc.includes(pattern) ||
                               pattern.includes(calledFunc);
                    });
                });
                
                if (hasMatch) {
                    callers.push(funcName);
                }
            }
        });
        
        return callers;
    }
    
    updateBreadcrumb(func) {
        const breadcrumb = document.getElementById('breadcrumb');
        breadcrumb.innerHTML = 
            '<li class="breadcrumb-item"><a href="#" onclick="window.functionNavigator.showWelcome(); return false;">ホーム</a></li>' +
            '<li class="breadcrumb-item">' + func.packageName + '</li>' +
            '<li class="breadcrumb-item active">' + 
            (func.receiverType ? func.receiverType + '.' : '') + func.functionName + '</li>';
    }
    
    updateActiveFunction(functionName) {
        // 全ての関数アイテムから active クラスを削除
        document.querySelectorAll('.function-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 選択された関数にactiveクラスを追加
        const activeItem = document.querySelector('[data-function="' + functionName + '"]');
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }
    
    showWelcome() {
        // URLハッシュをクリア
        if (window.location.hash) {
            // 履歴を残さずにURLを変更したい場合は replaceState を使う手もあるが
            // ここではシンプルに hash をクリアする（#だけ残る場合があるが許容）
            history.pushState("", document.title, window.location.pathname + window.location.search);
        }

        document.getElementById('welcome-message').style.display = 'block';
        document.getElementById('function-info').style.display = 'none';
        document.getElementById('mermaid-container').style.display = 'none';
        document.getElementById('call-relationships').style.display = 'none';
        
        document.getElementById('breadcrumb').innerHTML = 
            '<li class="breadcrumb-item active">ホーム</li>';
        
        this.updateActiveFunction(null);
    }
    
    showFunctionByCall(callName) {
        // 呼び出し名から実際の関数名を検索
        const matchingFunctions = Object.keys(this.functions).filter(funcName => {
            const func = this.functions[funcName];
            return callName.includes(func.functionName) || 
                   callName.includes(func.receiverType + '.' + func.functionName);
        });
        
        if (matchingFunctions.length > 0) {
            this.showFunction(matchingFunctions[0]);
        } else {
            // 関数が見つからない場合はToast通知を表示
            showToast(`リンク先「${callName}」はドキュメント化されていません`, 'warning');
        }
    }
    
    applyZoom() {
        const mermaidSvg = document.querySelector('.mermaid-wrapper svg');
        const wrapper = document.querySelector('.mermaid-wrapper');
        
        if (mermaidSvg && wrapper) {
            // SVGのみをスケール（外枠は固定）
            mermaidSvg.style.transform = 'scale(' + this.zoomLevel + ')';
            mermaidSvg.style.transformOrigin = 'top left';
            mermaidSvg.style.transition = 'transform 0.2s ease';
            
            // ラッパーのスクロール設定
            wrapper.style.overflow = 'auto';
            wrapper.style.maxHeight = '600px';
            
            // ズームレベルに応じてSVGコンテナのサイズを調整
            // Math.sign を使って比較演算子を回避
            const zoomDiff = this.zoomLevel - 1.0;
            const isSignificantlyZoomedOut = Math.sign(zoomDiff + 0.2) === -1; // 0.8倍以下で縮小とみなす
            
            // 常にスクロールバーを表示
            wrapper.style.overflow = 'auto';
        }
    }
    
    // 現在の状態を保存する
    saveCurrentState() {
        if (!this.currentFunction) return;
        
        // 現在のスクロール位置を取得
        const wrapper = document.querySelector('.mermaid-wrapper');
        const scrollTop = wrapper ? wrapper.scrollTop : 0;
        
        // 履歴の最後のエントリを更新
        if (this.navigationHistory.length > 0) {
            const lastEntry = this.navigationHistory[this.navigationHistory.length - 1];
            if (lastEntry.functionName === this.currentFunction) {
                lastEntry.scrollTop = scrollTop;
                lastEntry.zoomLevel = this.zoomLevel;
            }
        }
    }
    
    // 前の関数に戻る
    goBack() {
        if (this.navigationHistory.length < 2) {
            showToast('戻る履歴がありません', 'info');
            return;
        }
        
        // 現在の状態を保存
        this.saveCurrentState();
        
        // 履歴から現在のエントリを削除
        this.navigationHistory.pop();
        
        // 前のエントリを取得
        const previousEntry = this.navigationHistory[this.navigationHistory.length - 1];
        
        if (previousEntry && this.functions[previousEntry.functionName]) {
            // ズームレベルを復元
            this.zoomLevel = previousEntry.zoomLevel || 1;
            
            // 関数を表示（履歴に追加しない）
            this.showFunction(previousEntry.functionName, true);
            
            // スクロール位置を復元（少し遅延させて確実に適用）
            setTimeout(() => {
                this.restoreScrollPosition(previousEntry.scrollTop || 0);
            }, 100);
            
            showToast('前の関数に戻りました', 'success');
        } else {
            showToast('前の関数が見つかりません', 'warning');
        }
    }
    
    // スクロール位置を復元する
    restoreScrollPosition(scrollTop) {
        const wrapper = document.querySelector('.mermaid-wrapper');
        if (wrapper) {
            wrapper.scrollTop = scrollTop;
        }
    }
}

// Mermaidのクリックイベントから呼び出される関数
function navigateToFunction(functionCall) {
    if (!window.functionNavigator) {
        console.warn('FunctionNavigator is not initialized');
        return;
    }
    
    // 関数呼び出し名から実際の関数名を検索
    const matchingFunctions = Object.keys(window.functionNavigator.functions).filter(funcName => {
        const func = window.functionNavigator.functions[funcName];
        
        // 複数のパターンでマッチングを試行
        const patterns = [
            func.functionName,
            func.receiverType ? func.receiverType + '.' + func.functionName : null,
            func.fullName
        ].filter(pattern => pattern);
        
        return patterns.some(pattern => {
            return functionCall === pattern || 
                   functionCall.includes(pattern) ||
                   pattern.includes(functionCall);
        });
    });
    
    if (matchingFunctions.length > 0) {
        // 最初にマッチした関数を表示
        window.functionNavigator.showFunction(matchingFunctions[0]);
    } else {
        // 関数が見つからない場合はToast通知を表示
        showToast(`関数「${functionCall}」はドキュメント化されていません`, 'warning');
    }
}

// グローバル関数
function zoomIn() {
    if (window.functionNavigator) {
        window.functionNavigator.zoomLevel = Math.min(window.functionNavigator.zoomLevel * 1.2, 3);
        window.functionNavigator.applyZoom();
    }
}

function zoomOut() {
    if (window.functionNavigator) {
        window.functionNavigator.zoomLevel = Math.max(window.functionNavigator.zoomLevel / 1.2, 0.3);
        window.functionNavigator.applyZoom();
    }
}

function resetZoom() {
    if (window.functionNavigator) {
        window.functionNavigator.zoomLevel = 1;
        window.functionNavigator.applyZoom();
    }
}

// Toast通知を表示する関数
function showToast(message, type = 'info') {
    const toastElement = document.getElementById('notification-toast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    
    // タイプに応じてスタイルを設定
    toastElement.className = 'toast';
    toastTitle.textContent = '通知';
    
    switch (type) {
        case 'warning':
            toastElement.classList.add('text-bg-warning');
            toastTitle.textContent = '警告';
            break;
        case 'error':
            toastElement.classList.add('text-bg-danger');
            toastTitle.textContent = 'エラー';
            break;
        case 'success':
            toastElement.classList.add('text-bg-success');
            toastTitle.textContent = '成功';
            break;
        default:
            toastElement.classList.add('text-bg-info');
            break;
    }
    
    toastMessage.textContent = message;
    
    // Bootstrap Toastを表示
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 4000  // 4秒後に自動で消える
    });
    
    toast.show();
}

// メイン関数を表示する関数
function showMainFunction() {
    if (!window.functionNavigator) {
        showToast('システムが初期化されていません。しばらく待ってから再度お試しください。', 'warning');
        return;
    }
    
    // 複数の可能性のある関数名をチェック
    const possibleNames = [
        'MakeConversion',
        'cvUseCase.MakeConversion',
        'application/usecase.cvUseCase.MakeConversion',
        'usecase.cvUseCase.MakeConversion',
        'github.com/dmm-com/i3-cdp-cv-api/application/usecase.cvUseCase.MakeConversion'
    ];
    
    for (const name of possibleNames) {
        if (window.functionNavigator.functions[name]) {
            window.functionNavigator.showFunction(name);
            return;
        }
    }
    
    // 部分マッチで検索
    const allFunctions = Object.keys(window.functionNavigator.functions);
    const matchingFunction = allFunctions.find(funcName => 
        funcName.includes('MakeConversion') || 
        funcName.includes('cvUseCase')
    );
    
    if (matchingFunction) {
        window.functionNavigator.showFunction(matchingFunction);
        return;
    }
    
    showToast('メイン関数（MakeConversion）が見つかりませんでした。関数一覧から手動で選択してください。', 'warning');
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    // functionsDataが読み込まれているかチェック
    if (typeof functionsData === 'undefined') {
        console.error('functionsData is not loaded');
        return;
    }
    
    // Mermaidライブラリが読み込まれているかチェック
    if (typeof mermaid === 'undefined') {
        console.error('Mermaid library is not loaded');
        return;
    }
    
    // 少し遅延させてMermaidの初期化を確実にする
    setTimeout(() => {
        try {
            window.functionNavigator = new FunctionNavigator(functionsData);
            console.log('FunctionNavigator initialized successfully');
        } catch (error) {
            console.error('Failed to initialize FunctionNavigator:', error);
        }
    }, 100);
});
