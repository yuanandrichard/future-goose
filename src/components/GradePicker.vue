<template>
  <t-dialog
    :visible="visible"
    :header="null"
    :footer="null"
    :width="640"
    :close-on-overlay-click="false"
    :close-on-escape-key="false"
    :show-close="false"
    attach="body"
  >
    <div class="fg-picker">
      <div class="fg-picker-header">
        <div class="fg-picker-logo">🪿</div>
        <h2>你好呀，我是 <span class="fg-brand">未来鹅</span></h2>
        <p>在你开始之前，告诉我你现在的年级，我会用更适合你节奏的方式跟你聊～</p>
      </div>
      <div class="fg-grade-grid">
        <div
          v-for="g in gradeOptions"
          :key="g.value"
          class="fg-grade-card"
          :class="{ active: selected === g.value }"
          @click="selected = g.value"
        >
          <div class="fg-grade-emoji">{{ g.emoji }}</div>
          <div class="fg-grade-label">{{ g.label }}</div>
          <div class="fg-grade-tag">{{ g.tagline }}</div>
        </div>
      </div>
      <div class="fg-picker-actions">
        <t-checkbox v-model="remember">记住我，下次不再询问</t-checkbox>
        <t-button
          theme="primary"
          size="large"
          :disabled="!selected"
          @click="confirm"
        >
          开始我的大学陪伴 →
        </t-button>
      </div>
    </div>
  </t-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { gradeOptions } from '../data/gooseKnowledge'
import { storage } from '../utils/storage'

const props = defineProps({
  visible: { type: Boolean, default: false }
})
const emit = defineEmits(['confirm'])

const selected = ref('freshman')
const remember = ref(true)

watch(() => props.visible, (v) => {
  if (v) {
    const saved = storage.getGrade()
    if (saved) selected.value = saved
  }
})

function confirm() {
  if (!selected.value) return
  if (remember.value) storage.setGrade(selected.value)
  emit('confirm', selected.value)
}
</script>

<style scoped>
.fg-picker-header {
  text-align: center;
  padding: 8px 0 16px;
}
.fg-picker-logo {
  font-size: 48px;
  line-height: 1;
  margin-bottom: 8px;
}
.fg-picker-header h2 {
  margin: 0 0 8px;
  font-size: 22px;
}
.fg-brand {
  background: linear-gradient(90deg, #3ec5ff, #0077ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.fg-picker-header p {
  color: var(--goose-text-soft);
  margin: 0;
  font-size: 14px;
}
.fg-grade-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 16px 0;
}
.fg-grade-card {
  border: 2px solid var(--goose-border);
  border-radius: 14px;
  padding: 16px 14px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafcff;
}
.fg-grade-card:hover {
  border-color: var(--goose-primary-soft);
  transform: translateY(-2px);
}
.fg-grade-card.active {
  border-color: var(--goose-primary);
  background: var(--goose-primary-bg);
  box-shadow: 0 6px 16px rgba(0, 119, 255, 0.12);
}
.fg-grade-emoji { font-size: 28px; }
.fg-grade-label { font-weight: 600; font-size: 16px; margin-top: 6px; }
.fg-grade-tag { font-size: 12px; color: var(--goose-text-soft); margin-top: 4px; }
.fg-picker-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
@media (max-width: 600px) {
  .fg-grade-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
  .fg-grade-card { padding: 12px 8px; }
  .fg-picker-actions { flex-direction: column; gap: 12px; align-items: stretch; }
}
</style>
