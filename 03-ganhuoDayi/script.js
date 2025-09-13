// 获取DOM元素
const titleInput = document.getElementById('titleInput');
const contentInput = document.getElementById('contentInput');
const cardTitle = document.getElementById('cardTitle');
const cardContent = document.getElementById('cardContent');
const copyBtn = document.getElementById('copyBtn');
const copyMessage = document.getElementById('copyMessage');

// 实时更新卡片内容
titleInput.addEventListener('input', function() {
    cardTitle.textContent = this.value;
});

contentInput.addEventListener('input', function() {
    cardContent.textContent = this.value;
});

// 复制到剪贴板功能
copyBtn.addEventListener('click', async function() {
    try {
        // 创建一个临时的canvas元素来渲染卡片
        const cardContainer = document.querySelector('.card-container');
        
        // 使用html2canvas库将卡片转换为图像
        // 注意：需要先加载html2canvas库
        if (typeof html2canvas === 'undefined') {
            // 如果html2canvas未加载，则动态加载
            await loadHtml2Canvas();
        }
        
        const canvas = await html2canvas(cardContainer, {
            backgroundColor: null,
            scale: 2, // 提高图像质量
            logging: false
        });
        
        // 将canvas转换为Blob
        canvas.toBlob(async function(blob) {
            try {
                // 创建ClipboardItem对象
                const item = new ClipboardItem({ 'image/png': blob });
                
                // 写入剪贴板
                await navigator.clipboard.write([item]);
                
                // 显示成功消息
                showCopyMessage();
            } catch (err) {
                // 如果现代API不可用，尝试使用canvas.toDataURL方法
                fallbackCopyMethod(canvas);
            }
        });
    } catch (err) {
        console.error('复制失败:', err);
        alert('复制失败，请重试');
    }
});

// 加载html2canvas库
function loadHtml2Canvas() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// 备用复制方法
function fallbackCopyMethod(canvas) {
    // 创建一个链接元素
    const link = document.createElement('a');
    link.download = '干货卡片.png';
    link.href = canvas.toDataURL('image/png');
    
    // 模拟点击下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 提示用户
    alert('图片已下载，请手动复制');
}

// 显示复制成功消息
function showCopyMessage() {
    copyMessage.style.display = 'block';
    
    // 3秒后隐藏消息
    setTimeout(() => {
        copyMessage.style.display = 'none';
    }, 3000);
}
