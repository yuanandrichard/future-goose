<template>
  <div class="fg-app">
    <!-- 顶部品牌栏 -->
    <header class="fg-header">
      <div class="fg-header-inner">
        <div class="fg-brand-wrap">
          <div class="fg-brand-logo">🪿</div>
          <div>
            <div class="fg-brand-name">未来鹅 <span class="fg-brand-sub">FutureGoose</span></div>
            <div class="fg-brand-slogan">陪你从大一走到 Offer 的 AI 学长 / 学姐</div>
          </div>
        </div>
        <div class="fg-header-right">
          <t-tag v-if="grade" theme="primary" variant="light" size="medium">
            {{ currentGradeLabel }}
          </t-tag>
          <t-button variant="outline" size="small" @click="showPicker = true">切换年级</t-button>
          <t-button theme="primary" size="small" @click="showSettings = true">⚙️ 接入 AI</t-button>
        </div>
      </div>
    </header>

    <!-- Hero 欢迎区 -->
    <section class="fg-hero">
      <div class="fg-hero-inner">
        <h1>
          <span class="fg-hero-emoji">🪿</span>
          <span>你好，{{ grade ? currentGradeLabel : '同学' }}～</span>
        </h1>
        <p class="fg-hero-desc">
          我是「未来鹅」—— 一只懂互联网行业、懂你大学节奏的 AI 学长 / 学姐。<br/>
          你可以问我职业规划、实习、简历、面试、腾讯业务……<br/>
          迷茫的时候，我也会先听你说，<b>不灌鸡汤</b>。
        </p>
        <div class="fg-hero-stats">
          <div class="fg-stat">
            <div class="fg-stat-num">4</div>
            <div class="fg-stat-label">大学阶段</div>
          </div>
          <div class="fg-stat">
            <div class="fg-stat-num">∞</div>
            <div class="fg-stat-label">陪伴对话</div>
          </div>
          <div class="fg-stat">
            <div class="fg-stat-num">5+</div>
            <div class="fg-stat-label">鹅厂知识卡</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 主体三栏 -->
    <main class="fg-main" v-if="grade">
      <div class="fg-layout">
        <!-- 左：成长时间轴 + 知识卡清单 -->
        <div class="fg-col fg-col-left">
          <GrowthTimeline :grade="grade" @ask="askChat" />
          <KnowledgeDeck :grade="grade" @ask="askChat" />
        </div>

        <!-- 中：核心对话 -->
        <div class="fg-col fg-col-main">
          <ChatPanel ref="chatRef" :grade="grade" @open-settings="showSettings = true" />
        </div>
      </div>
    </main>

    <!-- 未选年级时引导 -->
    <main class="fg-main" v-else>
      <div class="fg-empty">
        <p>👆 顶部选择你的年级，我就能给你更贴心的回答啦</p>
      </div>
    </main>

    <!-- 底部 -->
    <footer class="fg-footer">
      <span>© 2026 未来鹅 FutureGoose · Demo · Made with 🪿 & Vue3 + TDesign</span>
      <span class="fg-footer-note">本 Demo 不会上传任何个人数据，配置仅保存在你的浏览器中</span>
    </footer>

    <!-- 弹窗 -->
    <GradePicker :visible="showPicker" @confirm="onPickGrade" />
    <SettingsDialog
      v-model:visible="showSettings"
      :settings="chatSettings"
      @save="onSaveSettings"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import GradePicker from './components/GradePicker.vue'
import SettingsDialog from './components/SettingsDialog.vue'
import GrowthTimeline from './components/GrowthTimeline.vue'
import KnowledgeDeck from './components/KnowledgeDeck.vue'
import ChatPanel from './components/ChatPanel.vue'
import { storage } from './utils/storage'
import { gradeOptions } from './data/gooseKnowledge'
import { useChat } from './composables/useChat'

const showPicker = ref(false)
const showSettings = ref(false)
const grade = ref('')
const chatRef = ref(null)

const { settings: chatSettings, saveSettings } = useChat()

const currentGradeLabel = computed(() => {
  const g = gradeOptions.find((x) => x.value === grade.value)
  return g ? g.label : ''
})

function onPickGrade(g) {
  grade.value = g
  storage.setGrade(g)
  showPicker.value = false
}

function onSaveSettings(next) {
  saveSettings(next)
  // 提示一下
  if (next.apiKey) {
    // 简单提示
  }
}

function askChat(text) {
  // 通过组件 ref 触发
  if (chatRef.value && typeof chatRef.value.onAskFromTimeline === 'function') {
    chatRef.value.onAskFromTimeline(text)
  }
}

onMounted(() => {
  const saved = storage.getGrade()
  if (saved) grade.value = saved
  else showPicker.value = true
})

// 切换年级时，让聊天重新初始化（重新挂载组件以刷新欢迎语）
watch(grade, () => {
  // 通过 key 强制刷新，这里我们用 v-if 方式更简单，但 App 是固定结构；
  // 选择年级后欢迎语已通过 storage 持久化在新一次进入时刷新。
  // 此处不做强制刷新，避免打断用户当前对话。
})
</script>

<style scoped>
.fg-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.fg-header {
  background: rgba(255,255,255,0.85);
  backdrop-filter: saturate(180%) blur(10px);
  border-bottom: 1px solid var(--goose-border);
  position: sticky;
  top: 0;
  z-index: 10;
}
.fg-header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.fg-brand-wrap { display: flex; align-items: center; gap: 12px; }
.fg-brand-logo {
  width: 40px; height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3ec5ff, #0077ff);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  box-shadow: 0 4px 10px rgba(0,119,255,0.25);
}
.fg-brand-name { font-weight: 700; font-size: 17px; }
.fg-brand-sub {
  font-weight: 500;
  font-size: 13px;
  color: var(--goose-text-soft);
  margin-left: 4px;
}
.fg-brand-slogan {
  font-size: 12px;
  color: var(--goose-text-soft);
  margin-top: 2px;
}
.fg-header-right { display: flex; align-items: center; gap: 8px; }

.fg-hero {
  background: linear-gradient(135deg, #cfe9ff 0%, #fff5e1 100%);
  padding: 36px 24px 28px;
}
.fg-hero-inner {
  max-width: 1280px;
  margin: 0 auto;
}
.fg-hero h1 {
  margin: 0 0 8px;
  font-size: 28px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.fg-hero-emoji { font-size: 32px; }
.fg-hero-desc {
  font-size: 14px;
  color: var(--goose-text-soft);
  line-height: 1.8;
  margin: 0;
}
.fg-hero-stats {
  display: flex;
  gap: 24px;
  margin-top: 18px;
}
.fg-stat {
  background: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.8);
  border-radius: 12px;
  padding: 10px 18px;
  backdrop-filter: blur(6px);
}
.fg-stat-num {
  font-size: 22px;
  font-weight: 700;
  color: var(--goose-primary);
  line-height: 1;
}
.fg-stat-label {
  font-size: 12px;
  color: var(--goose-text-soft);
  margin-top: 4px;
}

.fg-main {
  flex: 1;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 20px 24px 40px;
}
.fg-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 16px;
  align-items: flex-start;
}
.fg-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.fg-col-main {
  position: sticky;
  top: 80px;
  height: calc(100vh - 100px);
  min-height: 600px;
}

.fg-empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--goose-text-soft);
}

.fg-footer {
  text-align: center;
  padding: 18px 16px 24px;
  font-size: 12px;
  color: var(--goose-text-soft);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.fg-footer-note { opacity: 0.7; }

@media (max-width: 900px) {
  .fg-layout { grid-template-columns: 1fr; }
  .fg-col-main { position: static; height: auto; }
  .fg-hero h1 { font-size: 22px; }
  .fg-hero-stats { flex-wrap: wrap; }
}
</style>
