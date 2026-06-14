<template>
  <section class="fg-section fg-timeline">
    <div class="fg-timeline-head">
      <h3 class="fg-title">🎯 大学四年成长时间轴</h3>
      <p class="fg-subtitle">点击任意阶段，看看「未来鹅」给你这个阶段的核心建议</p>
    </div>
    <div class="fg-timeline-track">
      <div
        v-for="(node, idx) in growthTimeline"
        :key="node.key"
        class="fg-timeline-node"
        :class="{ active: activeKey === node.key }"
        :style="{ borderColor: activeKey === node.key ? node.color : 'transparent' }"
        @click="select(node)"
      >
        <div class="fg-node-dot" :style="{ background: node.color }">
          <span>{{ idx + 1 }}</span>
        </div>
        <div class="fg-node-title">{{ node.title }}</div>
        <div class="fg-node-short">{{ node.short }}</div>
      </div>
    </div>

    <transition name="fg-fade">
      <div v-if="activeNode" class="fg-timeline-detail" :key="activeNode.key">
        <div class="fg-detail-head" :style="{ background: hexToBg(activeNode.color) }">
          <div class="fg-detail-title">{{ activeNode.title }}</div>
          <div class="fg-detail-desc">{{ activeNode.desc }}</div>
        </div>
        <ul class="fg-detail-tips">
          <li v-for="(t, i) in activeNode.tips" :key="i">
            <span class="fg-tip-dot" :style="{ background: activeNode.color }"></span>
            <span>{{ t }}</span>
          </li>
        </ul>
        <div class="fg-detail-actions">
          <t-button size="small" theme="primary" variant="outline" @click="askAbout(activeNode)">
            问问未来鹅这个阶段
          </t-button>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { growthTimeline } from '../data/gooseKnowledge'

const props = defineProps({
  grade: { type: String, default: 'freshman' }
})
const emit = defineEmits(['ask'])

const activeKey = ref(props.grade === 'senior' ? 'jobHunt'
  : props.grade === 'junior' ? 'internship'
  : props.grade === 'sophomore' ? 'exploration'
  : 'cognition')

const activeNode = computed(() => growthTimeline.find(n => n.key === activeKey.value))

function select(node) {
  activeKey.value = node.key
}
function askAbout(node) {
  emit('ask', `我是${stageLabel(props.grade)}，聊聊【${node.title}】这个阶段最重要的事？`)
}
function stageLabel(g) {
  return { freshman: '大一', sophomore: '大二', junior: '大三', senior: '大四/研究生' }[g] || '大学生'
}
function hexToBg(hex) {
  // 转成淡色背景
  return hex + '1a'
}
</script>

<style scoped>
.fg-timeline-head { margin-bottom: 12px; }
.fg-timeline-track {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}
.fg-timeline-node {
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 12px 8px 10px;
  text-align: center;
  cursor: pointer;
  background: #fafcff;
  transition: all 0.2s;
}
.fg-timeline-node:hover { transform: translateY(-2px); }
.fg-node-dot {
  width: 28px; height: 28px;
  border-radius: 50%;
  margin: 0 auto 6px;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 12px; font-weight: 700;
  box-shadow: 0 3px 8px rgba(0,0,0,0.08);
}
.fg-node-title { font-size: 13px; font-weight: 600; }
.fg-node-short { font-size: 11px; color: var(--goose-text-soft); margin-top: 2px; }

.fg-timeline-detail {
  border-radius: 12px;
  border: 1px solid var(--goose-border);
  overflow: hidden;
  background: #fff;
}
.fg-detail-head {
  padding: 14px 16px;
}
.fg-detail-title { font-weight: 600; font-size: 15px; }
.fg-detail-desc { font-size: 13px; color: var(--goose-text-soft); margin-top: 4px; }
.fg-detail-tips {
  list-style: none;
  padding: 12px 16px 4px;
  margin: 0;
}
.fg-detail-tips li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  line-height: 1.7;
  padding: 4px 0;
  color: var(--goose-text);
}
.fg-tip-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  margin-top: 8px;
  flex-shrink: 0;
}
.fg-detail-actions {
  text-align: right;
  padding: 6px 12px 12px;
}
.fg-fade-enter-active, .fg-fade-leave-active { transition: all 0.25s ease; }
.fg-fade-enter-from, .fg-fade-leave-to { opacity: 0; transform: translateY(4px); }

@media (max-width: 700px) {
  .fg-timeline-track { grid-template-columns: 1fr 1fr; }
}
</style>
