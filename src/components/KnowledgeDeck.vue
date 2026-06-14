<template>
  <section class="fg-section fg-deck">
    <div class="fg-deck-head">
      <h3 class="fg-title">📚 鹅厂小知识 · 速览</h3>
      <p class="fg-subtitle">聊着聊着，未来鹅会主动给你推一张卡；这里是一份「预读清单」</p>
    </div>
    <div class="fg-deck-list">
      <div
        v-for="c in cards"
        :key="c.id"
        class="fg-deck-item"
        @click="ask(c)"
      >
        <div class="fg-deck-icon">{{ c.icon }}</div>
        <div class="fg-deck-meta">
          <div class="fg-deck-tag">{{ c.tag }}</div>
          <div class="fg-deck-title">{{ c.title }}</div>
          <div class="fg-deck-summary">{{ c.summary }}</div>
        </div>
        <div class="fg-deck-arrow">→</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gooseKnowledgeCards } from '../data/gooseKnowledge'

const props = defineProps({ grade: String })
const emit = defineEmits(['ask'])

const cards = gooseKnowledgeCards

function ask(c) {
  emit('ask', `详细给我讲讲「${c.title}」吧？`)
}
</script>

<style scoped>
.fg-deck-head { margin-bottom: 10px; }
.fg-deck-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.fg-deck-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #fafcff;
  border: 1px solid var(--goose-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.fg-deck-item:hover {
  background: var(--goose-primary-bg);
  border-color: var(--goose-primary-soft);
  transform: translateX(2px);
}
.fg-deck-icon {
  font-size: 24px;
  background: #fff;
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
.fg-deck-meta { flex: 1; min-width: 0; }
.fg-deck-tag {
  display: inline-block;
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--goose-warm-soft);
  color: #d18a3a;
  margin-bottom: 4px;
}
.fg-deck-title { font-weight: 600; font-size: 14px; }
.fg-deck-summary {
  font-size: 12px;
  color: var(--goose-text-soft);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fg-deck-arrow {
  color: var(--goose-primary);
  font-size: 18px;
  opacity: 0.5;
  transition: all 0.2s;
}
.fg-deck-item:hover .fg-deck-arrow {
  opacity: 1;
  transform: translateX(2px);
}
</style>
