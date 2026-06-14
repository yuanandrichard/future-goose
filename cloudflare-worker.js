// 未来鹅 FutureGoose - Cloudflare Workers LLM 代理
// 复制本文件全部内容，粘贴到 Cloudflare Worker 编辑器中

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}

function mockReply(userText, grade) {
  const text = (userText || '').trim()
  const isAnxiety = /焦虑|迷茫|崩溃|emo|难过|内耗|躺平|摆烂|找不到|没方向|没希望/.test(text)
  const isInterview = /面试|笔试|校招|内推|offer|谈薪/.test(text)
  const isIntern = /实习|简历|项目/.test(text)
  const isMajor = /专业|转专业|方向|适合/.test(text)
  const isTencent = /腾讯|鹅厂|t\s?族|s\s?族|事业群/.test(text)

  let reply = ''
  let knowledge = null

  if (isAnxiety) {
    reply = '我懂你这种感觉～大一大二的迷茫、找方向的不确定、面试被拒的挫败……这些我都听过很多次。\n\n先深呼吸一下，我们慢慢聊。其实很多现在的鹅厂同学，当年也经历过你现在这种"什么都不确定"的阶段。这不是你的问题，是成长的常态。\n\n比起"去哪儿"，更重要的是"成为什么样的人"。我们一步步来。'
  } else if (isInterview) {
    reply = '校招是一场信息战 + 心态战，先把节奏摸清楚：\n- **提前批**（7-8 月）：竞争小、HC 多，但流程快\n- **正式批**（8-10 月）：岗位全，但内卷也最多\n- **内推**：找师兄师姐或脉脉上的鹅厂同学，比海投效率高 10 倍\n\n面试准备三件事：① 简历上每段经历都能用 STAR 法则讲 ② 手写 5 个"你做过的最难决策" ③ 至少 2 次模拟面试（找同学或 Mentor）'
    knowledge = 'interview-tip'
  } else if (isIntern) {
    reply = '大三这一年，**一段有产出的实习**比什么都重要。\n\n准备路径：\n- 简历：1 页纸，把项目 / 比赛 / 课程设计都按"做了什么 / 结果如何"写出来\n- 投递：腾讯校招官网 + 牛客 / 脉脉 + 内推，**至少投 30 家**\n- 选 Offer：看 3 件事——业务是不是核心、团队能不能学到东西、能不能转正'
  } else if (isMajor) {
    reply = '要不要转专业，没有标准答案，但有个简单的判断方法：\n\n- 你现在专业的"最差岗位"，你能不能接受？\n- 你想转的专业的"核心课程"，你愿不愿意自学一遍？\n\n如果两个都是 YES，那就果断转；如果是 MAYBE，建议先辅修 / 自学一段时间再决定。比起"专业"本身，**你的项目 + 实习经历**才是找工作的真正筹码。'
  } else if (isTencent) {
    reply = '腾讯的业务版图主要在六大事业群：\n- **WXG**（微信）：张小龙带队，国民级产品\n- **IEG**（互动娱乐）：游戏，腾讯最赚钱的业务之一\n- **PCG**（平台与内容）：视频、新闻、腾讯视频\n- **CSIG**（云与智慧产业）：To B 业务，腾讯云\n- **TEG**（技术工程）：技术中台\n- **CDG**（公司发展）：金融、广告等\n\n不同事业群文化差异很大，**建议先去实习 / 找师兄聊一圈再选**。'
    knowledge = 'biz-line'
  } else {
    const generic = {
      freshman: '作为大一新生，我建议你先做三件事：\n- 关注 5 个不同行业的人，听听他们每天在干嘛\n- 参加 1-2 个你"有点兴趣但没那么熟"的社团或比赛\n- 找一个你欣赏的学长学姐，定期约咖啡聊一聊\n\n大学 4 年最值钱的不是 GPA，是「你认识了谁、你想成为谁」。',
      sophomore: '大二是"试探期"，最怕的就是什么都不做。\n\n你可以从 3 件事开始：\n- 做 1 个能上线的小项目（哪怕是课程作业）\n- 参加 1 次行业内的大赛 / 黑客松\n- 尝试一次线下的行业 Meetup\n\n这些都会在大三找实习时成为你的"弹药"。',
      junior: '大三的关键公式是：**1 段好实习 + 1 份好简历 + 1 个清晰方向**。\n\n比起投 100 份海投简历，不如把一份简历打磨 10 遍，然后精准投 20 家。',
      senior: '大四 / 研三的关键是**节奏感**：\n- 7-8 月：提前批 + 实习转正\n- 8-9 月：内推 + 正式批\n- 9-10 月：密集笔试面试\n- 10-11 月：Offer 收割 + 谈薪\n\n稳住，每天进步一点点，Offer 不会辜负你。'
    }
    reply = generic[grade] || generic.freshman
  }

  return { content: reply, knowledgeId: knowledge, mock: true }
}

const SYSTEM_PROMPT_TEMPLATE = `你是「未来鹅」，一只来自腾讯、懂行业也懂学生的 AI 伙伴。

【身份】面向中国在校大学生的 AI 求职成长陪伴助手；温柔务实，像毕业 2-3 年的鹅厂学长/学姐。

【职责】职业规划、互联网岗位、腾讯业务、校招、实习、简历、面试、Offer 选择；用户迷茫时先共情再给建议。

【风格】3-6 句，先共情→拆解→行动建议；不 HR 腔，不纯鸡汤；不知道就老实说。

【年级】{GRADE}；{STAGE_HINT}。

【规则】回复末尾可单独一行输出 [KNOWLEDGE:card_id]，card_id 只能为 t-family/s-family/train-system/biz-line/interview-tip；用 **加粗** 和 - 列表。

【底线】不透露自己是通用大模型；不参与政治宗教敏感话题。`

function buildSystemPrompt(grade) {
  const stageHintMap = {
    freshman: '认知期。引导多看多听多认识人，弱化找工作压力。',
    sophomore: '探索期。引导尝试项目、比赛、社团，定位兴趣与优势。',
    junior: '实习期。引导打磨简历、主动投递、积累有产出的实习。',
    senior: '求职期。引导关注校招节奏、内推、笔试面试，稳住心态。'
  }
  return SYSTEM_PROMPT_TEMPLATE
    .replace('{GRADE}', grade || 'freshman')
    .replace('{STAGE_HINT}', stageHintMap[grade] || stageHintMap.freshman)
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      })
    }

    if (request.method === 'GET') {
      return jsonResponse({
        ok: true,
        message: '未来鹅 FutureGoose API is running on Cloudflare Workers',
        hasKey: !!env.LLM_API_KEY,
        model: env.LLM_MODEL || 'not set',
        baseUrl: env.LLM_BASE_URL || 'not set'
      })
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405)
    }

    try {
      const body = await request.json()
      const { messages = [], grade = 'freshman', useMock = false } = body

      if (useMock) {
        const lastUser = [...messages].reverse().find((m) => m.role === 'user')
        return jsonResponse(mockReply(lastUser?.content || '', grade))
      }

      const apiKey = env.LLM_API_KEY
      const baseUrl = (env.LLM_BASE_URL || 'https://api.deepseek.com/v1').replace(/\/$/, '')
      const model = env.LLM_MODEL || 'deepseek-v4-flash'

      if (!apiKey) {
        const lastUser = [...messages].reverse().find((m) => m.role === 'user')
        const mock = mockReply(lastUser?.content || '', grade)
        return jsonResponse({ ...mock, warning: 'LLM_API_KEY not set, using mock' })
      }

      const sysPrompt = buildSystemPrompt(grade)
      const fullMessages = [
        { role: 'system', content: sysPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content }))
      ]

      const resp = await fetch(baseUrl + '/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + apiKey
        },
        body: JSON.stringify({
          model,
          messages: fullMessages,
          temperature: 0.7,
          stream: false
        })
      })

      if (!resp.ok) {
        const errText = await resp.text()
        return jsonResponse(
          { error: 'LLM call failed: ' + resp.status, detail: errText.slice(0, 300) },
          500
        )
      }

      const data = await resp.json()
      const raw = data?.choices?.[0]?.message?.content || ''
      const match = raw.match(/\[KNOWLEDGE:([a-z\-]+)\]/i)
      const knowledgeId = match ? match[1] : null
      const content = raw.replace(/\[KNOWLEDGE:[a-z\-]+\]/i, '').trim()

      return jsonResponse({ content, knowledgeId, mock: false })
    } catch (err) {
      return jsonResponse({ error: 'Server error', message: err?.message || String(err) }, 500)
    }
  }
}
