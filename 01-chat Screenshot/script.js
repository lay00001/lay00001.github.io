function updatePreview() {
    const message1 = document.getElementById('message1').value || '之前提交的查询，有结果了吗';
    const message2 = document.getElementById('message2').value || '久等了，违规原因已查询';
    const message3 = document.getElementById('message3').value || '经核实， 直播间主播涉及引导搜索绿泡泡相关内容，所以被管控，辛苦知悉';
    
    const preview = document.getElementById('chatPreview');
    preview.innerHTML = `
        <div class="message right">
            <div class="avatar"><img src="./img/avatar1.png" alt="用户头像" width="40" height="40"></div>
            <div class="message-content">
                <div class="message-text">${message1}</div>
            </div>
        </div>
        
        <div class="message left">
            <div class="avatar"><img src="./img/avatar2.png" alt="客服头像" width="40" height="40"></div>
            <div class="message-content">
                <div class="message-text">${message2}</div>
            </div>
        </div>
        
        <div class="message left">
            <div class="avatar"><img src="./img/avatar2.png" alt="客服头像" width="40" height="40"></div>
            <div class="message-content">
                <div class="message-text">${message3}</div>
            </div>
        </div>
    `;
}

async function captureScreenshot() {
    try {
        const chatElement = document.getElementById('chatPreview');
        
        // 使用html2canvas库进行截图
        const canvas = await html2canvas(chatElement, {
            backgroundColor: '#ffffff',
            scale: 2, // 高清截图
            logging: false
        });
        
        // 将canvas转换为blob
        canvas.toBlob(async (blob) => {
            try {
                // 复制到剪贴板
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]);
                
                alert('截图已复制到剪贴板！');
            } catch (err) {
                console.error('复制失败:', err);
                alert('复制失败，请尝试手动截图');
            }
        });
    } catch (err) {
        console.error('截图失败:', err);
        alert('截图功能需要现代浏览器支持');
    }
}

// 初始化预览
document.addEventListener('DOMContentLoaded', function() {
    // 监听输入变化
    document.getElementById('message1').addEventListener('input', updatePreview);
    document.getElementById('message2').addEventListener('input', updatePreview);
    document.getElementById('message3').addEventListener('input', updatePreview);
    
    // 初始更新一次预览
    updatePreview();
});
