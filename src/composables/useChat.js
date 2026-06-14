// 未来鹅 FutureGoose - 后端 LLM 代理 composable
// 走 Cloudflare Workers 后端（国内访问最稳）
// API Key 配置在 Cloudflare Workers 的环境变量中

import { ref } from 'vue'
import { storage } from '../utils/storage'

// Cloudflare Worker 后端地址
const API_BASE = 'https://future-goose-api.yuanandrichard.workers.dev'

export function useChat() {
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
      const messages = (history || []).map((m) => ({
        role: m.role,
        content: m.content
      }))
      messages.push({ role: 'user', content: userText })

      const resp = await fetch(API_BASE, {
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
