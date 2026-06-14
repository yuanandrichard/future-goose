// 极简 markdown 渲染：仅支持 **加粗**、- 列表、换行
// 避免引入额外依赖，足够「未来鹅」日常使用
export function renderMarkdown(text = '') {
  if (!text) return ''
  const escape = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const lines = text.split('\n')
  let html = ''
  let inList = false
  for (let raw of lines) {
    const line = escape(raw)
    if (/^\s*-\s+/.test(raw)) {
      if (!inList) {
        html += '<ul>'
        inList = true
      }
      html += '<li>' + line.replace(/^\s*-\s+/, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') + '</li>'
    } else {
      if (inList) {
        html += '</ul>'
        inList = false
      }
      if (line.trim() === '') {
        html += '<br/>'
      } else {
        html += '<p>' + line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') + '</p>'
      }
    }
  }
  if (inList) html += '</ul>'
  return html
}
