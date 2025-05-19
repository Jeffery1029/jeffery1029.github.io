// markdown.js
// 輕量級 Markdown 轉 HTML（僅支援標題、粗體、斜體、ul/li、hr、分段）
window.simpleMarkdownToHtml = function(md) {
  let html = md
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^---+$/gm, '<hr>')
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.*?)\*/g, '<i>$1</i>')
    .replace(/^\s*\- (.*)$/gm, '<li>$1</li>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/^([^-<].*)$/gm, '<p>$1</p>');
  // 處理 ul
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  // 移除多餘 <p></p>
  html = html.replace(/<p><\/p>/g, '');
  // 移除 <p> 包住 <ul> 的情況
  html = html.replace(/<p>(<ul>[\s\S]*?<\/ul>)<\/p>/g, '$1');
  return html.replace(/^<p>/, '').replace(/<\/p>$/, '');
};
