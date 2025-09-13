// 为工具卡片添加点击事件
document.addEventListener('DOMContentLoaded', function() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            // 获取工具名称
            const toolName = this.querySelector('span').textContent;
            
            // 根据不同的工具名称跳转到不同的页面
            if (toolName.includes('抖音客服聊天截图生成器')) {
                window.location.href = '../01-chat Screenshot/index.html';
            } else if (toolName.includes('直播岗位贴片生成器')) {
                window.location.href = '../02-streamJob/index.html';
            } else {
                alert(`您点击了: ${toolName}\n该功能正在开发中...`);
            }
        });
    });
});
