// 简单的HTTP服务器启动脚本
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// MIME类型映射
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  console.log(`请求: ${req.url}`);
  
  // 处理根路径请求
  let filePath = req.url === '/' ? './index.html' : '.' + req.url;
  
  // 获取文件扩展名
  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // 读取文件
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 文件不存在
        fs.readFile('./404.html', (err, content) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content || '404 Not Found', 'utf-8');
        });
      } else {
        // 服务器错误
        res.writeHead(500);
        res.end(`服务器错误: ${err.code}`);
      }
    } else {
      // 成功响应
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`按 Ctrl+C 停止服务器`);
  
  // 尝试自动打开浏览器
  const url = `http://localhost:${PORT}`;
  const { platform } = process;
  
  // 根据操作系统选择打开浏览器的命令
  let command;
  
  switch (platform) {
    case 'darwin': // macOS
      command = `open "${url}"`;
      break;
    case 'win32': // Windows
      command = `start "${url}"`;
      break;
    default: // Linux
      command = `xdg-open "${url}"`;
      break;
  }
  
  // 执行命令
  const { exec } = require('child_process');
  exec(command, (err) => {
    if (err) {
      console.log(`无法自动打开浏览器，请手动访问: ${url}`);
    }
  });
});
