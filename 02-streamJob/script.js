// 获取DOM元素
const companyNameInput = document.getElementById('company-name');
const jobsList = document.getElementById('jobs-list');
const addJobBtn = document.getElementById('add-job');
const copyCardBtn = document.getElementById('copy-card');
const downloadCardBtn = document.getElementById('download-card');
const jobCard = document.getElementById('job-card');
const excelUpload = document.getElementById('excel-upload');
const uploadStatus = document.getElementById('upload-status');
const batchPreviewSection = document.getElementById('batch-preview-section');
const batchCardsContainer = document.getElementById('batch-cards-container');
const downloadAllCardsBtn = document.getElementById('download-all-cards');
const batchCardTemplate = document.getElementById('batch-card-template');

// 存储批量生成的贴片数据
let batchCardsData = [];
    
    // 当前岗位数量
    let jobCount = 1;
    
    // 实时更新贴片函数
    function updateCardRealTime() {
        // 获取公司名称
        const companyName = companyNameInput.value.trim() || '公司名称';
        
        // 获取所有岗位信息
        const jobTitles = document.querySelectorAll('.job-title');
        const jobSalaries = document.querySelectorAll('.job-salary');
        const jobs = [];
        
        for (let i = 0; i < jobTitles.length; i++) {
            const title = jobTitles[i].value.trim() || '普工';
            const salary = jobSalaries[i].value.trim() || '5000-8000';
            jobs.push({ title: title, salary: salary });
        }
        
        // 更新贴片
        updateCard(companyName, jobs);
    }
    
    // 为公司名称输入框添加实时更新事件
    companyNameInput.addEventListener('input', updateCardRealTime);
    
    // 为所有输入框添加实时更新事件的函数
    function addRealTimeListeners() {
        const jobTitles = document.querySelectorAll('.job-title');
        const jobSalaries = document.querySelectorAll('.job-salary');
        
        // 移除旧的监听器，避免重复添加
        jobTitles.forEach(title => {
            const newTitle = title.cloneNode(true);
            title.parentNode.replaceChild(newTitle, title);
        });
        
        jobSalaries.forEach(salary => {
            const newSalary = salary.cloneNode(true);
            salary.parentNode.replaceChild(newSalary, salary);
        });
        
        // 添加新的监听器
        document.querySelectorAll('.job-title').forEach(input => {
            input.addEventListener('input', updateCardRealTime);
        });
        
        document.querySelectorAll('.job-salary').forEach(input => {
            input.addEventListener('input', updateCardRealTime);
        });
    }
    
    // 初始添加监听器
    addRealTimeListeners();
    
    // 添加岗位
    addJobBtn.addEventListener('click', function() {
        if (jobCount >= 6) {
            alert('最多只能添加6个岗位！');
            return;
        }
        
        jobCount++;
        
        const jobItem = document.createElement('div');
        jobItem.className = 'job-item';
        jobItem.innerHTML = `
            <div class="form-group">
                <input type="text" id="job-title-${jobCount}" class="job-title" placeholder="如：普工">
            </div>
            <div class="form-group">
                <input type="text" id="job-salary-${jobCount}" class="job-salary" placeholder="如：5000-8000">
            </div>
            <button class="remove-job" data-id="${jobCount}">删除</button>
        `;
        
        jobsList.appendChild(jobItem);
        
        // 添加删除事件监听
        const removeBtn = jobItem.querySelector('.remove-job');
        removeBtn.addEventListener('click', function() {
            jobsList.removeChild(jobItem);
            jobCount--;
            // 删除岗位后重新添加监听器并更新贴片
            addRealTimeListeners();
            updateCardRealTime();
        });
        
        // 为新添加的岗位输入框添加实时更新事件
        addRealTimeListeners();
        // 更新贴片预览
        updateCardRealTime();
    });
    
    // 为初始岗位添加删除事件监听
    document.querySelector('.remove-job').addEventListener('click', function() {
        if (jobCount <= 1) {
            alert('至少需要保留一个岗位！');
            return;
        }
        
        const jobItem = this.closest('.job-item');
        jobsList.removeChild(jobItem);
        jobCount--;
        // 删除岗位后重新添加监听器并更新贴片
        addRealTimeListeners();
        updateCardRealTime();
    });
    
    // 更新贴片
    function updateCard(companyName, jobs) {
        // 更新公司名称
        const companyTitle = jobCard.querySelector('.company-title .title');
        companyTitle.textContent = companyName;
        
        // 检查公司名称长度，如果超过13个字，则隐藏两侧的line
        const lines = jobCard.querySelectorAll('.company-title .line');
        if (companyName.length > 13) {
            lines.forEach(line => {
                line.style.display = 'none';
            });
            // 调整标题的margin，使其居中显示
            companyTitle.style.margin = '0';
        } else {
            lines.forEach(line => {
                line.style.display = 'block';
            });
            // 恢复原始margin
            companyTitle.style.margin = '0 10px';
        }
        
        // 清空现有岗位
        const leftColumn = document.createElement('div');
        leftColumn.className = 'jobs-column';
        
        const rightColumn = document.createElement('div');
        rightColumn.className = 'jobs-column';
        
        // 添加岗位信息
        for (let i = 0; i < jobs.length; i++) {
            const job = jobs[i];
            const jobInfo = document.createElement('div');
            jobInfo.className = 'job-info';
            
            // 当职位数量在3个以内时，添加no-ellipsis类以禁用截断处理
            if (jobs.length <= 3) {
                jobInfo.classList.add('no-ellipsis');
            }
            
            jobInfo.innerHTML = '<span>' + job.title + '&nbsp;' + job.salary + '</span>';
            
            // 前3个岗位放左侧，后3个岗位放右侧
            if (i < 3) {
                leftColumn.appendChild(jobInfo);
            } else {
                rightColumn.appendChild(jobInfo);
            }
        }
        
        // 如果岗位不足6个，添加空白占位
        for (let i = jobs.length; i < 6; i++) {
            const jobInfo = document.createElement('div');
            jobInfo.className = 'job-info';
            jobInfo.innerHTML = '<span>&nbsp;</span>';
            
            if (i < 3) {
                leftColumn.appendChild(jobInfo);
            } else {
                rightColumn.appendChild(jobInfo);
            }
        }
        
        // 更新DOM
        const jobsGrid = jobCard.querySelector('.jobs-grid');
        jobsGrid.innerHTML = '';
        jobsGrid.appendChild(leftColumn);
        jobsGrid.appendChild(rightColumn);
    }
    
    // 复制到剪贴板
    copyCardBtn.addEventListener('click', function() {
        // 创建一个新的canvas，专门用于处理透明背景
        createTransparentCanvas(jobCard).then(function(transparentCanvas) {
            // 首先尝试现代的Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                transparentCanvas.toBlob(function(blob) {
                    const item = new ClipboardItem({ "image/png": blob });
                    navigator.clipboard.write([item]).then(function() {
                        alert('贴片已成功复制到剪贴板！');
                    }).catch(function(error) {
                        console.error('Clipboard API 复制失败: ', error);
                        // 如果失败，尝试使用下载方式作为备选
                        fallbackToDownload(transparentCanvas);
                    });
                });
            } else {
                // 对于不支持现代API的浏览器，直接使用下载作为备选
                fallbackToDownload(transparentCanvas);
            }
        }).catch(function(error) {
            console.error('生成图片失败: ', error);
            alert('生成图片失败，请刷新页面重试。');
        });
    });
    
    // 当复制失败时，提供下载作为备选方案
    function fallbackToDownload(canvas) {
        const userChoice = confirm('Chrome浏览器在localhost环境下可能限制剪贴板API。\n\n是否直接下载图片？');
        if (userChoice) {
            const link = document.createElement('a');
            link.download = '招聘贴片.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    }
    
    // 下载贴片
    downloadCardBtn.addEventListener('click', function() {
        createTransparentCanvas(jobCard).then(function(transparentCanvas) {
            const link = document.createElement('a');
            link.download = '招聘贴片.png';
            link.href = transparentCanvas.toDataURL('image/png');
            link.click();
        }).catch(function(error) {
            console.error('生成图片失败: ', error);
            alert('生成图片失败，请刷新页面重试。');
        });
    });
    
    // 创建带有透明背景的canvas
    function createTransparentCanvas(element) {
        return new Promise(function(resolve, reject) {
            html2canvas(element, {
                backgroundColor: null,  // 设置为null以支持透明背景
                useCORS: true,          // 支持跨域图片
                scale: 1,               // 保持原图大小
                logging: false,
                allowTaint: false,
                removeContainer: false,
                imageTimeout: 0,
                width: element.offsetWidth,
                height: element.offsetHeight
            }).then(function(canvas) {
                // 创建一个新的canvas，确保背景是完全透明的
                const transparentCanvas = document.createElement('canvas');
                const ctx = transparentCanvas.getContext('2d');
                
                // 设置相同的尺寸
                transparentCanvas.width = canvas.width;
                transparentCanvas.height = canvas.height;
                
                // 清除画布，确保背景透明
                ctx.clearRect(0, 0, transparentCanvas.width, transparentCanvas.height);
                
                // 将原始canvas绘制到新canvas上
                ctx.drawImage(canvas, 0, 0);
                
                // 处理白色背景问题 - 将所有接近白色的像素设置为透明
                const imageData = ctx.getImageData(0, 0, transparentCanvas.width, transparentCanvas.height);
                const data = imageData.data;
                
                for (let i = 0; i < data.length; i += 4) {
                    // 获取像素的RGB值
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    
                    // 如果像素接近白色（R、G、B值都很高），设置透明度为0
                    if (r > 240 && g > 240 && b > 240) {
                        data[i + 3] = 0; // 设置alpha通道为0（完全透明）
                    }
                }
                
                // 将处理后的图像数据放回画布
                ctx.putImageData(imageData, 0, 0);
                
                resolve(transparentCanvas);
            }).catch(function(error) {
                reject(error);
            });
        });
    }
    
// 等待DOM加载完成后再初始化
function initApplication() {
    // 重新获取DOM元素，确保它们已加载
    const excelUpload = document.getElementById('excel-upload');
    const downloadAllCardsBtn = document.getElementById('download-all-cards');
    
    // 初始化贴片
    updateCard('公司名称', [
        { title: '普工', salary: '5000-8000' },
        { title: '普工', salary: '5000-8000' },
        { title: '普工', salary: '5000-8000' },
        { title: '普工', salary: '5000-8000' },
        { title: '普工', salary: '5000-8000' },
        { title: '普工', salary: '5000-8000' }
    ]);
    
    // 监听Excel文件上传
    if (excelUpload) {
        excelUpload.addEventListener('change', handleExcelUpload);
    }
    
    // 监听下载所有贴片按钮点击事件
    if (downloadAllCardsBtn) {
        downloadAllCardsBtn.addEventListener('click', downloadAllCards);
    }
}

// 当DOM加载完成时初始化应用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApplication);
} else {
    // 如果DOM已经加载完成，直接初始化
    initApplication();
}

// 处理Excel文件上传
function handleExcelUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    
    // 检查文件类型
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
        showUploadStatus('请上传.xlsx或.xls格式的Excel文件！', 'error');
        return;
    }
    
    showUploadStatus('正在解析文件...', '');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // 获取第一个工作表
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            
            // 将工作表转换为JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            if (jsonData.length === 0) {
                showUploadStatus('Excel文件中没有数据！', 'error');
                return;
            }
            
            // 处理Excel数据
            processExcelData(jsonData);
            showUploadStatus('文件解析成功！已生成' + batchCardsData.length + '个公司的招聘贴片。', 'success');
            
            // 显示批量预览区域
            batchPreviewSection.style.display = 'block';
            
            // 滚动到批量预览区域
            batchPreviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
        } catch (error) {
            console.error('解析Excel文件失败:', error);
            showUploadStatus('解析Excel文件失败，请检查文件格式是否正确！', 'error');
        }
    };
    
    reader.onerror = function() {
        showUploadStatus('读取文件失败！', 'error');
    };
    
    reader.readAsArrayBuffer(file);
}

// 处理Excel数据
function processExcelData(jsonData) {
    // 按公司名称分组
    const companyJobsMap = new Map();
    
    jsonData.forEach(row => {
        // 尝试获取公司名称、岗位名称和薪资范围（兼容不同的Excel表头）
        const companyName = getValueFromRow(row, ['公司名称', '公司', '企业名称', '企业']);
        const jobTitle = getValueFromRow(row, ['岗位名称', '岗位', '职位名称', '职位']);
        
        // 尝试获取薪资范围，或者获取薪资起和薪资止并合并
        let jobSalary = getValueFromRow(row, ['薪资范围', '薪资', '工资范围', '工资']);
        
        // 如果没有直接的薪资范围，尝试获取薪资起和薪资止并合并
        if (!jobSalary) {
            const salaryStart = getValueFromRow(row, ['薪资起', '起薪', '工资起', '最低工资']);
            const salaryEnd = getValueFromRow(row, ['薪资止', '止薪', '工资止', '最高工资']);
            
            // 如果有薪资起和/或薪资止，合并成薪资范围
            if (salaryStart && salaryEnd) {
                jobSalary = `${salaryStart}-${salaryEnd}`;
            } else if (salaryStart) {
                jobSalary = `${salaryStart}以上`;
            } else if (salaryEnd) {
                jobSalary = `不超过${salaryEnd}`;
            }
        }
        
        // 跳过无效数据
        if (!companyName || !jobTitle) {
            return;
        }
        
        // 如果公司还没有在映射中，创建一个新数组
        if (!companyJobsMap.has(companyName)) {
            companyJobsMap.set(companyName, []);
        }
        
        // 将岗位添加到公司的岗位列表中
        companyJobsMap.get(companyName).push({
            title: jobTitle,
            salary: jobSalary || '薪资面议'
        });
    });
    
    // 转换为数组并限制每个公司最多6个岗位
    batchCardsData = [];
    companyJobsMap.forEach((jobs, companyName) => {
        // 限制最多6个岗位
        const limitedJobs = jobs.slice(0, 6);
        batchCardsData.push({
            companyName: companyName,
            jobs: limitedJobs
        });
    });
    
    // 生成批量贴片
    renderBatchCards();
}

// 从行数据中获取值（尝试多个可能的键名）
function getValueFromRow(row, possibleKeys) {
    for (const key of possibleKeys) {
        // 尝试直接匹配键名
        if (row.hasOwnProperty(key) && row[key] !== undefined && row[key] !== null && row[key] !== '') {
            return String(row[key]).trim();
        }
        
        // 尝试不区分大小写匹配键名
        for (const actualKey in row) {
            if (actualKey.toLowerCase() === key.toLowerCase() && 
                row[actualKey] !== undefined && 
                row[actualKey] !== null && 
                row[actualKey] !== '') {
                return String(row[actualKey]).trim();
            }
        }
    }
    
    return '';
}

// 渲染批量贴片
function renderBatchCards() {
    // 清空容器
    batchCardsContainer.innerHTML = '';
    
    // 为每个公司生成贴片
    batchCardsData.forEach((cardData, index) => {
        // 克隆模板
        const cardClone = batchCardTemplate.cloneNode(true);
        cardClone.id = `batch-card-${index}`;
        cardClone.style.display = 'block';
        cardClone.style.cursor = 'pointer';
        
        // 更新公司名称和岗位信息
        updateBatchCard(cardClone, cardData.companyName, cardData.jobs);
        
        // 为贴片本身添加点击事件实现下载
        cardClone.addEventListener('click', function() {
            downloadSingleBatchCard(cardClone, cardData.companyName);
        });
        
        // 添加到容器
        batchCardsContainer.appendChild(cardClone);
    });
}

// 更新批量贴片
function updateBatchCard(cardElement, companyName, jobs) {
    // 更新公司名称
    const companyTitle = cardElement.querySelector('.company-title .title');
    companyTitle.textContent = companyName;
    
    // 检查公司名称长度，如果超过13个字，则隐藏两侧的line
    const lines = cardElement.querySelectorAll('.company-title .line');
    if (companyName.length > 13) {
        lines.forEach(line => {
            line.style.display = 'none';
        });
        // 调整标题的margin，使其居中显示
        companyTitle.style.margin = '0';
    } else {
        lines.forEach(line => {
            line.style.display = 'block';
        });
        // 恢复原始margin
        companyTitle.style.margin = '0 10px';
    }
    
    // 清空现有岗位
    const leftColumn = document.createElement('div');
    leftColumn.className = 'jobs-column';
    
    const rightColumn = document.createElement('div');
    rightColumn.className = 'jobs-column';
    
    // 添加岗位信息
    for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        const jobInfo = document.createElement('div');
        jobInfo.className = 'job-info';
        
        // 当职位数量在3个以内时，添加no-ellipsis类以禁用截断处理
        if (jobs.length <= 3) {
            jobInfo.classList.add('no-ellipsis');
        }
        
        jobInfo.innerHTML = '<span>' + job.title + '&nbsp;' + job.salary + '</span>';
        
        // 前3个岗位放左侧，后3个岗位放右侧
        if (i < 3) {
            leftColumn.appendChild(jobInfo);
        } else {
            rightColumn.appendChild(jobInfo);
        }
    }
    
    // 如果岗位不足6个，添加空白占位
    for (let i = jobs.length; i < 6; i++) {
        const jobInfo = document.createElement('div');
        jobInfo.className = 'job-info';
        jobInfo.innerHTML = '<span>&nbsp;</span>';
        
        if (i < 3) {
            leftColumn.appendChild(jobInfo);
        } else {
            rightColumn.appendChild(jobInfo);
        }
    }
    
    // 更新DOM
    const jobsGrid = cardElement.querySelector('.jobs-grid');
    jobsGrid.innerHTML = '';
    jobsGrid.appendChild(leftColumn);
    jobsGrid.appendChild(rightColumn);
}

// 下载单个批量贴片
function downloadSingleBatchCard(cardElement, companyName) {
    createTransparentCanvas(cardElement).then(function(transparentCanvas) {
        const link = document.createElement('a');
        link.download = `${companyName}_招聘贴片.png`;
        link.href = transparentCanvas.toDataURL('image/png');
        link.click();
    }).catch(function(error) {
        console.error('生成图片失败: ', error);
        alert('生成图片失败，请刷新页面重试。');
    });
}

// 下载所有贴片
function downloadAllCards() {
    if (batchCardsData.length === 0) {
        alert('没有可下载的贴片！');
        return;
    }
    
    // 创建一个新的JSZip实例
    const zip = new JSZip();
    const imagePromises = [];
    
    // 显示处理中的提示
    alert(`正在打包${batchCardsData.length}个贴片，请稍候...`);
    
    // 为每个贴片创建一个Promise来生成图片
    batchCardsData.forEach((cardData, index) => {
        const cardElement = document.getElementById(`batch-card-${index}`);
        if (cardElement) {
            const imagePromise = createTransparentCanvas(cardElement)
                .then(canvas => {
                    // 将canvas转换为Blob对象
                    return new Promise((resolve) => {
                        canvas.toBlob((blob) => {
                            // 将图片添加到ZIP文件中
                            zip.file(`${cardData.companyName}_招聘贴片.png`, blob);
                            resolve();
                        }, 'image/png');
                    });
                })
                .catch(error => {
                    console.error(`生成${cardData.companyName}贴片失败:`, error);
                    return Promise.resolve(); // 即使有错误也继续处理其他贴片
                });
            
            imagePromises.push(imagePromise);
        }
    });
    
    // 等待所有图片生成完成
    Promise.all(imagePromises).then(() => {
        // 生成ZIP文件
        zip.generateAsync({ type: 'blob' }).then(content => {
            // 创建下载链接
            const link = document.createElement('a');
            link.download = `招聘贴片批量下载_${new Date().toLocaleDateString()}.zip`;
            link.href = URL.createObjectURL(content);
            link.click();
            
            // 释放URL对象
            setTimeout(() => URL.revokeObjectURL(link.href), 100);
            
            alert(`成功打包并下载了${batchCardsData.length}个贴片！`);
        }).catch(error => {
            console.error('生成ZIP文件失败:', error);
            alert('打包贴片失败，请刷新页面重试。');
        });
    }).catch(error => {
        console.error('处理贴片时发生错误:', error);
        alert('处理贴片时发生错误，请刷新页面重试。');
    });
}

// 显示上传状态
function showUploadStatus(message, type) {
    uploadStatus.textContent = message;
    uploadStatus.className = 'upload-status';
    
    if (type) {
        uploadStatus.classList.add(type);
    }
    
    // 3秒后清除成功状态
    if (type === 'success') {
        setTimeout(() => {
            uploadStatus.textContent = '';
            uploadStatus.className = 'upload-status';
        }, 3000);
    }
}
