document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const cardText = document.getElementById('card-text');
    const cardContent = document.getElementById('card-content');
    const cardBg = document.getElementById('card-bg');
    const card = document.getElementById('card');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const backgroundOptions = document.querySelectorAll('.background-option');
    
    // 初始化卡片内容
    cardText.value = cardContent.textContent;
    
    // 监听文本输入，实时更新卡片内容
    cardText.addEventListener('input', function() {
        cardContent.textContent = this.value || '这里是自定义内容，跟随输入动态变化';
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
