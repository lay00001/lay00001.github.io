document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const dateInput = document.getElementById('date');
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    const downloadBtn1 = document.getElementById('downloadBtn1');
    const downloadBtn2 = document.getElementById('downloadBtn2');
    const downloadBothBtn = document.getElementById('downloadBothBtn');
    const posterCanvas1 = document.getElementById('posterCanvas1');
    const posterCanvas2 = document.getElementById('posterCanvas2');
    
    // 设置默认日期为今天
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
    
    // 设置默认时间
    startTimeInput.value = '16:00';
    endTimeInput.value = '18:00';
    
    // 添加日期和时间输入框的变化事件监听器，实现自动生成海报
    dateInput.addEventListener('change', generatePosters);
    startTimeInput.addEventListener('change', generatePosters);
    endTimeInput.addEventListener('change', generatePosters);
    
    // 下载海报按钮点击事件
    downloadBtn1.addEventListener('click', function() { downloadPoster(posterCanvas1, 1); });
    downloadBtn2.addEventListener('click', function() { downloadPoster(posterCanvas2, 2); });
    downloadBothBtn.addEventListener('click', downloadBothPosters);
    
    // 生成海报函数
    function generatePosters() {
        // 获取用户输入
        const date = dateInput.value;
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        
        // 验证输入
        if (!date || !startTime || !endTime) {
            alert('请填写所有必填字段');
            return;
        }
        
        // 格式化日期为中文格式（YYYY年MM月DD日）
        const formattedDate = formatChineseDate(date);
        
        // 格式化时间（去掉前导零）
        const formattedStartTime = formatTime(startTime);
        const formattedEndTime = formatTime(endTime);
        
        // 生成两个海报，分别使用模板1和模板2
        generateSinglePoster(posterCanvas1, '1', formattedDate, formattedStartTime, formattedEndTime);
        generateSinglePoster(posterCanvas2, '2', formattedDate, formattedStartTime, formattedEndTime);
        
        // 启用下载按钮
        downloadBtn1.disabled = false;
        downloadBtn2.disabled = false;
        downloadBothBtn.disabled = false;
    }
    
    // 生成单个海报函数
    function generateSinglePoster(canvasElement, templateId, formattedDate, formattedStartTime, formattedEndTime) {
        // 清空画布
        canvasElement.innerHTML = '';
        
        // 添加模板类
        canvasElement.className = 'poster-canvas template-' + templateId;
        
        // 创建海报背景
        const background = document.createElement('img');
        background.src = `assets/CodeBubbyAssets/286_67/${templateId}.png`;
        background.className = 'poster-background';
        canvasElement.appendChild(background);
        
        // 创建日期元素
        const dateElement = document.createElement('div');
        dateElement.className = 'poster-date';
        dateElement.textContent = formattedDate;
        canvasElement.appendChild(dateElement);
        
        // 创建时间元素
        const timeElement = document.createElement('div');
        timeElement.className = 'poster-time';
        
        // 开始时间（加粗）
        const startTimeSpan = document.createElement('span');
        startTimeSpan.className = 'time-bold';
        startTimeSpan.textContent = formattedStartTime;
        timeElement.appendChild(startTimeSpan);
        
        // 空格
        const space1 = document.createElement('span');
        space1.className = 'time-normal';
        space1.innerHTML = '&nbsp;';
        timeElement.appendChild(space1);
        
        // "至"字
        const toSpan = document.createElement('span');
        toSpan.className = 'time-normal';
        toSpan.style.fontSize = '60%';
        toSpan.textContent = '至';
        timeElement.appendChild(toSpan);
        
        // 空格
        const space2 = document.createElement('span');
        space2.className = 'time-normal';
        space2.innerHTML = '&nbsp;';
        timeElement.appendChild(space2);
        
        // 结束时间（加粗）
        const endTimeSpan = document.createElement('span');
        endTimeSpan.className = 'time-bold';
        endTimeSpan.textContent = formattedEndTime;
        timeElement.appendChild(endTimeSpan);
        
        canvasElement.appendChild(timeElement);
    }
    
    // 下载单个海报函数
    function downloadPoster(canvasElement, templateId) {
        // 使用html2canvas将海报转换为图片
        html2canvas(canvasElement, {
            scale: 4, // 提高分辨率
            useCORS: true, // 允许跨域图片
            backgroundColor: null // 透明背景
        }).then(canvas => {
            // 创建下载链接
            const link = document.createElement('a');
            link.download = `海报_模板${templateId}_${dateInput.value}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }
    
    // 同时下载两个海报函数
    function downloadBothPosters() {
        // 创建JSZip实例
        const zip = new JSZip();
        
        // 转换第一个海报
        html2canvas(posterCanvas1, {
            scale: 4,
            useCORS: true,
            backgroundColor: null
        }).then(canvas1 => {
            // 添加第一个海报到ZIP文件
            zip.file(`海报_模板1_${dateInput.value}.png`, canvas1.toDataURL().split(',')[1], {base64: true});
            
            // 转换第二个海报
            return html2canvas(posterCanvas2, {
                scale: 4,
                useCORS: true,
                backgroundColor: null
            });
        }).then(canvas2 => {
            // 添加第二个海报到ZIP文件
            zip.file(`海报_模板2_${dateInput.value}.png`, canvas2.toDataURL().split(',')[1], {base64: true});
            
            // 生成ZIP文件并下载
            zip.generateAsync({type: 'blob'}).then(content => {
                const link = document.createElement('a');
                link.download = `海报合集_${dateInput.value}.zip`;
                link.href = URL.createObjectURL(content);
                link.click();
            });
        });
    }
    
    // 格式化日期为中文格式（YYYY年MM月DD日）
    function formatChineseDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${String(month).padStart(2, '0')}月${String(day).padStart(2, '0')}日`;
    }
    
    // 格式化时间（去掉前导零）
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        return `${parseInt(hours)}:${minutes}`;
    }
    
    // 初始生成一次海报
    generatePosters();
});
