// 未来鹅 FutureGoose - LLM 调用 composable
// 部署后统一走 /api/chat（EdgeOne Pages Functions），
// Key 存在后端环境变量，前端不再直接暴露

import { ref } from 'vue'
import { storage } from '../utils/storage'

export function useChat() {
  // 前端不再需要 apiKey，保留一个空 settings 对象兼容旧逻辑
  const settings = ref({ useMock: false })
  const loading = ref(false)
  const errorMsg = ref('')

  function saveSettings(next) {
    settings.value = { ...settings.value, ...next }
  }

  async function sendMessage(userText, history, grade) {
    errorMsg.value = ''
    loading.value = true
    try {
      // 构造发给后端的消息
      const messages = (history || []).map((m) => ({
        role: m.role,
        content: m.content
      }))
      messages.push({ role: 'user', content: userText })

      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          grade,
          useMock: false
        })
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err?.error || '请求失败 ' + resp.status)
      }

      const data = await resp.json()
      return {
        content: data.content || '',
        knowledgeId: data.knowledgeId || null
      }
    } catch (e) {
      errorMsg.value = e?.message || '出错了，请稍后再试'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    settings,
    loading,
    errorMsg,
    saveSettings,
    sendMessage
  }
}
