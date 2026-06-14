<template>
  <t-dialog
    :visible="visible"
    header="⚙️  接入说明"
    :width="480"
    :footer="null"
    @update:visible="(v) => emit('update:visible', v)"
  >
    <p class="fg-tip">
      未来鹅已接入云端 AI 服务，<b>无需你再配置 API Key</b>，打开就能直接用～
    </p>
    <p class="fg-tip" style="background: #fff8ee; border-left-color: #ffb86b;">
      如果你希望使用自己的 API Key（如 DeepSeek / 智谱 / OpenAI），需要在部署平台（EdgeOne Pages / Vercel）
      配置环境变量 <code>LLM_API_KEY</code>、<code>LLM_BASE_URL</code>、<code>LLM_MODEL</code>。
    </p>
    <p class="fg-tip" style="background: #e8fff3; border-left-color: #2ec27e;">
      ✅ 当前模式：<b>云端代理模式</b>（推荐）<br/>
      ✅ 你的 Key 不会泄露到前端<br/>
      ✅ 所有访问者都能直接用
    </p>

    <div class="fg-actions">
      <t-button theme="primary" @click="close">知道了</t-button>
    </div>
  </t-dialog>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, default: false }
})
const emit = defineEmits(['update:visible'])

function close() {
  emit('update:visible', false)
}
</script>

<style scoped>
.fg-tip {
  color: var(--goose-text-soft);
  font-size: 13px;
  margin: 0 0 12px;
  background: var(--goose-primary-bg);
  padding: 10px 12px;
  border-radius: 8px;
  border-left: 3px solid var(--goose-primary);
  line-height: 1.6;
}
.fg-tip code {
  background: #fff;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--goose-primary);
  border: 1px solid var(--goose-border);
}
.fg-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>
