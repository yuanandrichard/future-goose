// 未来鹅 FutureGoose - localStorage 持久化工具

const KEYS = {
  GRADE: 'fg_grade',
  HISTORY: 'fg_chat_history',
  SETTINGS: 'fg_settings'
}

export const storage = {
  getGrade() {
    return localStorage.getItem(KEYS.GRADE) || ''
  },
  setGrade(grade) {
    localStorage.setItem(KEYS.GRADE, grade)
  },

  getHistory() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.HISTORY) || '[]')
    } catch (e) {
      return []
    }
  },
  setHistory(list) {
    // 仅保留最近 50 条，避免 localStorage 过大
    const arr = Array.isArray(list) ? list.slice(-50) : []
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(arr))
  },
  clearHistory() {
    localStorage.removeItem(KEYS.HISTORY)
  },

  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.SETTINGS) || '{}')
    } catch (e) {
      return {}
    }
  },
  setSettings(obj) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(obj || {}))
  }
}
