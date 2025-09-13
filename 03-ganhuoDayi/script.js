document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const cardText = document.getElementById('card-text');
    const cardContent = document.getElementById('card-content');
    const cardBg = document.getElementById('card-bg');
    const card = document.getElementById('card');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const backgroundOptions = document.querySelectorAll('.background-option');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // 标签切换功能
    function initTabs() {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // 获取标签ID
                const tabId = this.getAttribute('data-tab');
                
                // 移除所有标签的active类
                tabs.forEach(t => t.classList.remove('active'));
                
                // 添加当前标签的active类
                this.classList.add('active');
                
                // 隐藏所有内容区域
                tabContents.forEach(content => content.classList.remove('active'));
                
                // 显示当前标签对应的内容区域
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
    }
    
    // 初始化标签切换
    initTabs();
    
    // 批量生成相关元素
    const batchInput = document.getElementById('batch-input');
    const generateBatchBtn = document.getElementById('generate-batch-btn');
    const batchPreviewContainer = document.getElementById('batch-preview-container');
    const batchCards = document.getElementById('batch-cards');
    const batchCopyBtn = document.getElementById('batch-copy-btn');
    const batchDownloadBtn = document.getElementById('batch-download-btn');
    
    // 初始化卡片内容
    cardText.value = cardContent.textContent;
    
    // 监听文本输入，实时更新卡片内容
    cardText.addEventListener('input', function() {
        // 保留换行格式，将换行符转换为<br>标签
        cardContent.innerHTML = (this.value || '这里是自定义内容，跟随输入动态变化').replace(/\n/g, '<br>');
    });
    
    // 背景选择功能
    backgroundOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除所有active类
            backgroundOptions.forEach(opt => opt.classList.remove('active'));
            // 添加active类到当前选中项
            this.classList.add('active');
            
            // 更新卡片背景
            const bgNumber = this.getAttribute('data-bg');
            cardBg.src = `assets/CodeBubbyAssets/233_6/${bgNumber}.png`;
        });
    });
    
    // 复制到剪贴板功能
    copyBtn.addEventListener('click', function() {
        // 使用html2canvas将卡片转换为图像，设置backgroundColor: null以获得透明背景
        html2canvas(card, { backgroundColor: null }).then(canvas => {
            // 将canvas转换为blob
            canvas.toBlob(function(blob) {
                // 创建ClipboardItem对象
                const item = new ClipboardItem({ "image/png": blob });
                
                // 写入剪贴板
                navigator.clipboard.write([item]).then(function() {
                    alert('卡片已复制到剪贴板！');
                }, function(error) {
                    console.error('复制失败: ', error);
                    fallbackCopyMethod(canvas);
                });
            });
        });
    });
    
    // 下载卡片功能
    downloadBtn.addEventListener('click', function() {
        // 使用html2canvas将卡片转换为图像，设置backgroundColor: null以获得透明背景
        html2canvas(card, { backgroundColor: null }).then(canvas => {
            // 创建下载链接
            const link = document.createElement('a');
            link.download = '我的卡片.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
    
    // 批量生成卡片功能
    generateBatchBtn.addEventListener('click', function() {
        const inputText = batchInput.value.trim();
        if (!inputText) {
            alert('请输入卡片内容');
            return;
        }
        
        // 清空批量预览区域
        batchCards.innerHTML = '';
        
        // 按行分割文本
        const lines = inputText.split('\n').filter(line => line.trim());
        
        // 解析每一行并生成卡片
        const cardsData = [];
        lines.forEach((line, index) => {
            // 解析行格式：类型：内容
            const match = line.match(/^(互动答疑|干货分享)：(.*)$/);
            if (match) {
                const type = match[1];
                const content = match[2];
                cardsData.push({ type, content });
            } else {
                // 默认使用干货分享类型
                cardsData.push({ type: '干货分享', content: line });
            }
        });
        
        // 生成卡片元素
        cardsData.forEach((cardData, index) => {
            // 创建卡片容器
            const cardContainer = document.createElement('div');
            cardContainer.className = 'batch-card-container';
            
            // 创建卡片
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.id = `batch-card-${index}`;
            
            // 为卡片添加点击事件，触发编辑功能
            cardElement.addEventListener('click', function() {
                // 获取内容元素
                const contentElement = this.querySelector('.card-content');
                if (contentElement) {
                    // 显示编辑弹窗，从innerHTML中恢复原始文本内容（将<br>转回换行符）
                    const originalContent = contentElement.innerHTML.replace(/<br\s*\/?>/gi, '\n');
                    showEditModal(index, originalContent, cardData.type);
                }
            });
            
            // 创建背景图片
            const bgImage = document.createElement('img');
            const bgNumber = cardData.type === '干货分享' ? 1 : 2;
            bgImage.src = `assets/CodeBubbyAssets/233_6/${bgNumber}.png`;
            
            // 创建内容元素
            const contentElement = document.createElement('div');
            contentElement.className = 'card-content';
            // 保留换行格式，将换行符转换为<br>标签
            contentElement.innerHTML = cardData.content.replace(/\n/g, '<br>');
            
            // 组装卡片
            cardElement.appendChild(bgImage);
            cardElement.appendChild(contentElement);
            cardContainer.appendChild(cardElement);
            batchCards.appendChild(cardContainer);
        });
        
        // 显示批量预览区域
        batchPreviewContainer.style.display = 'block';
    });
    
    // 批量复制卡片功能
    batchCopyBtn.addEventListener('click', function() {
        const batchCardElements = document.querySelectorAll('[id^="batch-card-"]');
        if (batchCardElements.length === 0) {
            alert('没有可复制的卡片');
            return;
        }
        
        // 依次复制每个卡片
        let copiedCount = 0;
        const copyNextCard = (index) => {
            if (index >= batchCardElements.length) {
                alert(`已成功复制 ${copiedCount} 张卡片到剪贴板！`);
                return;
            }
            
            const card = batchCardElements[index];
            html2canvas(card, { backgroundColor: null }).then(canvas => {
                canvas.toBlob(function(blob) {
                    const item = new ClipboardItem({ "image/png": blob });
                    
                    navigator.clipboard.write([item]).then(function() {
                        copiedCount++;
                        copyNextCard(index + 1);
                    }, function(error) {
                        console.error('复制失败: ', error);
                        copyNextCard(index + 1);
                    });
                });
            });
        };
        
        copyNextCard(0);
    });
    
    // 批量下载卡片功能
    batchDownloadBtn.addEventListener('click', function() {
        const batchCardElements = document.querySelectorAll('[id^="batch-card-"]');
        if (batchCardElements.length === 0) {
            alert('没有可下载的卡片');
            return;
        }
        
        // 依次下载每个卡片
        let downloadedCount = 0;
        const downloadNextCard = (index) => {
            if (index >= batchCardElements.length) {
                alert(`已成功下载 ${downloadedCount} 张卡片！`);
                return;
            }
            
            const card = batchCardElements[index];
            html2canvas(card, { backgroundColor: null }).then(canvas => {
                const link = document.createElement('a');
                link.download = `我的卡片${index + 1}.png`;
                link.href = canvas.toDataURL('image/png');
                
                // 使用定时器确保连续下载
                setTimeout(() => {
                    link.click();
                    downloadedCount++;
                    downloadNextCard(index + 1);
                }, 500);
            });
        };
        
        downloadNextCard(0);
    });
    
    // 编辑弹窗功能
    function showEditModal(cardIndex, currentContent, cardType) {
        // 检查是否已存在编辑弹窗
        let modal = document.getElementById('edit-modal');
        if (!modal) {
            // 创建编辑弹窗
            modal = document.createElement('div');
            modal.id = 'edit-modal';
            modal.className = 'modal';
            
            // 创建弹窗内容
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            
            // 创建标题
            const modalTitle = document.createElement('h3');
            modalTitle.textContent = '编辑卡片内容';
            
            // 创建文本区域
            const textarea = document.createElement('textarea');
            textarea.id = 'edit-textarea';
            textarea.className = 'edit-textarea';
            textarea.placeholder = '请输入卡片内容';
            textarea.rows = 8;
            
            // 创建类型选择
            const typeContainer = document.createElement('div');
            typeContainer.className = 'type-container';
            
            const typeLabel = document.createElement('label');
            typeLabel.textContent = '卡片类型：';
            
            const typeSelect = document.createElement('select');
            typeSelect.id = 'edit-type';
            
            const option1 = document.createElement('option');
            option1.value = '干货分享';
            option1.textContent = '干货分享';
            
            const option2 = document.createElement('option');
            option2.value = '互动答疑';
            option2.textContent = '互动答疑';
            
            typeSelect.appendChild(option1);
            typeSelect.appendChild(option2);
            typeContainer.appendChild(typeLabel);
            typeContainer.appendChild(typeSelect);
            
            // 创建按钮容器
            const modalActions = document.createElement('div');
            modalActions.className = 'modal-actions';
            
            // 创建取消按钮
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn cancel-btn';
            cancelBtn.textContent = '取消';
            cancelBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            // 创建保存按钮
            const saveBtn = document.createElement('button');
            saveBtn.className = 'btn save-btn';
            saveBtn.textContent = '保存';
            
            // 组装弹窗内容
            modalActions.appendChild(cancelBtn);
            modalActions.appendChild(saveBtn);
            modalContent.appendChild(modalTitle);
            modalContent.appendChild(textarea);
            modalContent.appendChild(typeContainer);
            modalContent.appendChild(modalActions);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
        }
        
        // 设置弹窗内容
        document.getElementById('edit-textarea').value = currentContent;
        document.getElementById('edit-type').value = cardType;
        
        // 每次显示弹窗时，重新绑定保存按钮的点击事件，确保使用最新的cardIndex
        const saveBtn = document.querySelector('#edit-modal .save-btn');
        if (saveBtn) {
            // 移除旧的事件监听器
            const newSaveBtn = saveBtn.cloneNode(true);
            saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
            
            // 添加新的事件监听器
            newSaveBtn.addEventListener('click', function() {
                // 获取新内容
                const newContent = document.getElementById('edit-textarea').value.trim();
                if (!newContent) {
                    alert('内容不能为空');
                    return;
                }
                
                // 获取新类型
                const newType = document.getElementById('edit-type').value;
                
                // 更新卡片
                updateBatchCard(cardIndex, newContent, newType);
                
                // 关闭弹窗
                modal.style.display = 'none';
            });
        }
        
        // 显示弹窗
        modal.style.display = 'block';
    }
    
    // 更新批量卡片内容
    function updateBatchCard(cardIndex, newContent, newType) {
        const cardElement = document.getElementById(`batch-card-${cardIndex}`);
        if (cardElement) {
            // 更新内容
            const contentElement = cardElement.querySelector('.card-content');
            if (contentElement) {
                // 保留换行格式，将换行符转换为<br>标签
                contentElement.innerHTML = newContent.replace(/\n/g, '<br>');
            }
            
            // 更新背景
            const bgImage = cardElement.querySelector('img');
            if (bgImage) {
                const bgNumber = newType === '干货分享' ? 1 : 2;
                bgImage.src = `assets/CodeBubbyAssets/233_6/${bgNumber}.png`;
            }
        }
    }
    
    // 剪贴板API不可用时的备用复制方法
    function fallbackCopyMethod(canvas) {
        // 创建一个临时的img元素
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        
        // 创建一个临时的div来包含图像
        const container = document.createElement('div');
        container.appendChild(img);
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        
        // 添加到DOM
        document.body.appendChild(container);
        
        // 创建选区
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNode(container);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // 尝试复制
        try {
            document.execCommand('copy');
            alert('卡片已复制到剪贴板！(使用备用方法)');
        } catch (err) {
            alert('复制失败，请尝试下载卡片。');
            console.error('复制失败: ', err);
        }
        
        // 清理
        selection.removeAllRanges();
        document.body.removeChild(container);
    }
});
