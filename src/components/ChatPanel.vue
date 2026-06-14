<template>
  <section class="fg-section fg-chat">
    <div class="fg-chat-head">
      <div class="fg-chat-title">
        <span class="fg-chat-avatar">🪿</span>
        <div>
          <div class="fg-chat-name">未来鹅 <span class="fg-chat-stage">· {{ stageLabel }}</span></div>
          <div class="fg-chat-status">
            <span class="fg-dot"></span>
            在线 · 会认真听你说话
          </div>
        </div>
      </div>
      <div class="fg-chat-actions">
        <t-button size="small" variant="text" @click="$emit('open-settings')">⚙️ 接入 AI</t-button>
        <t-button size="small" variant="text" theme="danger" @click="clearAll">清空对话</t-button>
      </div>
    </div>

    <div class="fg-recommend" v-if="messages.length <= 1">
      <div class="fg-recommend-label">你可能想问：</div>
      <div class="fg-recommend-list">
        <span
          v-for="(q, i) in recommendQuestions"
          :key="i"
          class="fg-chip"
          @click="quickAsk(q)"
        >{{ q }}</span>
      </div>
    </div>

    <div ref="listRef" class="fg-chat-list">
      <div
        v-for="(m, idx) in messages"
        :key="idx"
        class="fg-msg"
        :class="m.role"
      >
        <div class="fg-msg-avatar">
          {{ m.role === 'user' ? '🙂' : '🪿' }}
        </div>
        <div class="fg-msg-bubble">
          <div v-if="m.role === 'assistant'" class="fg-md" v-html="renderMd(m.content)"></div>
          <div v-else class="fg-msg-text">{{ m.content }}</div>
          <KnowledgeCard v-if="m.knowledge" :card="m.knowledge" />
        </div>
      </div>
      <div v-if="loading" class="fg-msg assistant">
        <div class="fg-msg-avatar">🪿</div>
        <div class="fg-msg-bubble fg-typing">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>

    <div class="fg-chat-input">
      <t-textarea
        v-model="input"
        :autosize="{ minRows: 1, maxRows: 4 }"
        placeholder="跟未来鹅聊聊你的困惑吧～（Enter 发送，Shift+Enter 换行）"
        @keydown="onKeydown"
      />
      <t-button
        class="fg-send-btn"
        theme="primary"
        :loading="loading"
        :disabled="!input.trim()"
        @click="send"
      >发送</t-button>
    </div>
    <div v-if="errorMsg" class="fg-chat-error">⚠️ {{ errorMsg }}</div>
  </section>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
// TDesign 通过 app.use(TDesign) 全量注册，直接在模板里用 <t-button> 等即可
import KnowledgeCard from './KnowledgeCard.vue'
import { storage } from '../utils/storage'
import { useChat } from '../composables/useChat'
import { gradeRecommendations, gooseKnowledgeCards } from '../data/gooseKnowledge'
import { renderMarkdown } from '../utils/markdown'

const props = defineProps({
  grade: { type: String, required: true }
})
const emit = defineEmits(['open-settings'])

const { loading, errorMsg, sendMessage } = useChat()
const listRef = ref(null)
const input = ref('')

// 初始消息
const greeting = computed(() => gradeRecommendations[props.grade]?.greeting || '你好呀～')
const stageLabel = computed(() => ({ freshman: '大一新生', sophomore: '大二探索中', junior: '大三冲实习', senior: '大四 / 求职冲刺' })[props.grade])
const recommendQuestions = computed(() => gradeRecommendations[props.grade]?.questions || [])

const messages = ref([])

function initMessages() {
  const saved = storage.getHistory()
  if (saved && saved.length) {
    messages.value = saved
  } else {
    messages.value = [{ role: 'assistant', content: greeting.value }]
  }
}

function persist() {
  // 把 knowledge 引用去掉再存，避免循环引用问题（这里我们转成 id 存）
  const safe = messages.value.map((m) => ({
    role: m.role,
    content: m.content,
    knowledgeId: m.knowledge?.id || null
  }))
  storage.setHistory(safe)
}

function renderMd(text) {
  return renderMarkdown(text)
}

function scrollToBottom() {
  nextTick(() => {
    const el = listRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

async function send() {
  const text = input.value.trim()
  if (!text || loading.value) return
  input.value = ''
  messages.value.push({ role: 'user', content: text })
  scrollToBottom()
  persist()

  try {
    const { content, knowledgeId } = await sendMessage(
      text,
      messages.value,
      props.grade
    )
    const knowledge = knowledgeId
      ? gooseKnowledgeCards.find((k) => k.id === knowledgeId)
      : null
    messages.value.push({ role: 'assistant', content, knowledge })
    scrollToBottom()
    persist()
  } catch (e) {
    messages.value.push({
      role: 'assistant',
      content: '抱歉，刚才信号不太好……要不要换个方式再说一次？'
    })
    persist()
  }
}

function quickAsk(q) {
  input.value = q
  send()
}

function onKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

function clearAll() {
  messages.value = [{ role: 'assistant', content: greeting.value }]
  storage.clearHistory()
}

function onAskFromTimeline(text) {
  input.value = text
  send()
}

defineExpose({ onAskFromTimeline })

onMounted(() => {
  initMessages()
  scrollToBottom()
})

// 切换年级时，重置对话，让欢迎语与年级重新匹配
watch(() => props.grade, (next, prev) => {
  if (next && next !== prev) {
    storage.clearHistory()
    messages.value = [{ role: 'assistant', content: gradeRecommendations[next]?.greeting || '你好呀～' }]
    scrollToBottom()
  }
})
</script>

<style scoped>
.fg-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 540px;
  padding: 0;
  overflow: hidden;
}
.fg-chat-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--goose-border);
  background: linear-gradient(90deg, #f5fbff 0%, #fff 100%);
}
.fg-chat-title { display: flex; align-items: center; gap: 12px; }
.fg-chat-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3ec5ff, #0077ff);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  box-shadow: 0 4px 10px rgba(0,119,255,0.25);
}
.fg-chat-name { font-weight: 600; font-size: 15px; }
.fg-chat-stage { color: var(--goose-text-soft); font-weight: 400; font-size: 13px; }
.fg-chat-status {
  font-size: 12px;
  color: var(--goose-text-soft);
  display: flex; align-items: center; gap: 4px;
}
.fg-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #2ec27e;
  display: inline-block;
  animation: fgPulse 1.4s ease-in-out infinite;
}
@keyframes fgPulse {
  0%, 100% { opacity: 0.4; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.2); }
}
.fg-chat-actions { display: flex; gap: 4px; }

.fg-recommend {
  padding: 12px 20px 0;
}
.fg-recommend-label {
  font-size: 12px; color: var(--goose-text-soft); margin-bottom: 6px;
}
.fg-recommend-list {
  display: flex; flex-wrap: wrap; gap: 8px;
}
.fg-chip {
  background: #fff;
  border: 1px solid var(--goose-border);
  color: var(--goose-primary);
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s;
}
.fg-chip:hover {
  background: var(--goose-primary);
  color: #fff;
  border-color: var(--goose-primary);
  transform: translateY(-1px);
}

.fg-chat-list {
  flex: 1;
  padding: 16px 20px;
  overflow-y: auto;
  background: #fbfdff;
  min-height: 320px;
}
.fg-msg {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
  align-items: flex-start;
}
.fg-msg.user { flex-direction: row-reverse; }
.fg-msg-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
.fg-msg-bubble {
  max-width: 78%;
  padding: 10px 14px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid var(--goose-border);
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;
}
.fg-msg.user .fg-msg-bubble {
  background: var(--goose-primary);
  color: #fff;
  border-color: var(--goose-primary);
  border-top-right-radius: 4px;
}
.fg-msg.assistant .fg-msg-bubble {
  border-top-left-radius: 4px;
  background: #fff;
}
.fg-msg.user .fg-msg-text { white-space: pre-wrap; }

.fg-typing {
  display: flex; gap: 4px; padding: 14px 16px;
}
.fg-typing span {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--goose-primary-soft);
  animation: fgTyping 1.2s infinite;
}
.fg-typing span:nth-child(2) { animation-delay: 0.2s; }
.fg-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes fgTyping {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-4px); opacity: 1; }
}

.fg-chat-input {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--goose-border);
  background: #fff;
  align-items: flex-end;
}
.fg-chat-input :deep(.t-textarea) {
  flex: 1;
}
.fg-send-btn { height: 36px; }
.fg-chat-error {
  padding: 0 16px 12px;
  font-size: 12px;
  color: #d23b3b;
}
</style>
