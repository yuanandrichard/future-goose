<template>
  <div class="fg-knowledge-card">
    <div class="fg-kc-head">
      <div class="fg-kc-icon">{{ card.icon }}</div>
      <div class="fg-kc-meta">
        <div class="fg-kc-tag">{{ card.tag }}</div>
        <div class="fg-kc-title">{{ card.title }}</div>
      </div>
    </div>
    <div class="fg-kc-summary">{{ card.summary }}</div>
    <div class="fg-kc-detail">{{ card.detail }}</div>
    <div class="fg-kc-foot">— 来自未来鹅 🪿</div>
  </div>
</template>

<script setup>
defineProps({
  card: { type: Object, required: true }
})
</script>

<style scoped>
.fg-knowledge-card {
  background: linear-gradient(135deg, #f0f8ff 0%, #fff8ee 100%);
  border: 1px solid #ffe2bd;
  border-radius: 14px;
  padding: 14px 16px;
  margin-top: 8px;
  max-width: 92%;
  box-shadow: 0 4px 12px rgba(255, 184, 107, 0.12);
  animation: fgKcIn 0.4s ease;
}
@keyframes fgKcIn {
  from { opacity: 0; transform: translateY(6px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.fg-kc-head { display: flex; align-items: center; gap: 10px; }
.fg-kc-icon {
  font-size: 28px;
  background: #fff;
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
.fg-kc-meta { flex: 1; }
.fg-kc-tag {
  display: inline-block;
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 6px;
  background: var(--goose-primary);
  color: #fff;
  margin-bottom: 4px;
}
.fg-kc-title { font-weight: 600; font-size: 14px; }
.fg-kc-summary {
  margin-top: 10px;
  font-size: 13px;
  color: var(--goose-text);
  font-weight: 500;
  line-height: 1.6;
}
.fg-kc-detail {
  margin-top: 6px;
  font-size: 12px;
  color: var(--goose-text-soft);
  line-height: 1.7;
}
.fg-kc-foot {
  margin-top: 10px;
  font-size: 11px;
  color: #c2a073;
  text-align: right;
}
</style>
