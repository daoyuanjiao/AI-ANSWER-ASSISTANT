# Gemini API 配置指南

## 📋 模型配置系统分析

### 配置页面位置
- **入口**: popup.html 中的"API设置"按钮 (齿轮图标)
- **类型**: 模态框浮层
- **功能**: AI模型管理界面

### 配置系统架构

#### 1. 数据存储
- **存储方式**: Chrome Storage Sync API
- **存储字段**:
  - `aiModels`: 模型列表数组
  - `activeModelId`: 当前激活的模型ID
  - 每个模型包含: `id`, `name`, `baseUrl`, `apiKey`, `model`, `builtin`

#### 2. 内置模型
```javascript
{
  id: "builtin-default",
  name: "默认",
  baseUrl: "https://d.yikfun.de5.net/",
  apiKey: "default",
  model: "Doubao-1.5-pro",
  builtin: true
}
```

#### 3. 自定义模型配置表单
模型编辑页面包含4个必填字段：
| 字段 | 说明 | 示例 |
|------|------|------|
| **模型名称** | 自定义名称 | Gemini Pro |
| **Base URL** | API端点基础地址 | https://api.openai.com/v1 |
| **API Key** | 认证密钥 | sk-... 或 gkey-... |
| **模型ID** | 模型标识符 | gpt-4o-mini 或 gemini-pro |

#### 4. 配置流程
1. 用户点击"API设置" → 打开模型列表
2. 点击"添加自定义模型" → 打开编辑表单
3. 填写4个必填字段
4. 点击"保存" → 验证并保存到存储
5. 模型自动出现在列表中，可选为活跃模型
6. 后续API调用会使用该配置

### API 调用方式

#### 后台服务处理
文件: `background.js`

```javascript
async function callAI(config, prompt, mode = 'answer') {
  const { baseUrl, apiKey, model } = config;
  
  // 构建URL（自动补全路径）
  let url = baseUrl.replace(/\/$/, '');
  if (!url.endsWith('/chat/completions')) {
    url += '/chat/completions';
  }
  
  // 发送请求
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [...]
    })
  });
}
```

**关键特点**:
- ✅ 支持 OpenAI 兼容格式的API
- ✅ 自动处理Base URL路径补全
- ✅ 标准的Bearer Token认证

---

## 🔧 Gemini API 配置方法

### 方案 A: 使用 OpenAI 兼容代理（推荐）

Google官方不提供OpenAI兼容接口，需要使用第三方代理或转接服务。

#### 配置步骤

**1. 在模型配置页面添加新模型**
- 点击"添加自定义模型" 按钮

**2. 填写配置信息**

| 配置项 | 值 |
|--------|-----|
| 模型名称 | `Gemini 2.0 Flash` |
| Base URL | `https://api.openai-hk.com/v1` 或其他兼容代理 |
| API Key | 您的代理服务API密钥 |
| 模型ID | `gemini-2.0-flash` 或其他Gemini模型 |

**3. 保存并激活**
- 点击"保存"按钮
- 在模型列表中选中该模型作为活跃模型
- 日志区显示"已使用Gemini模型"即配置成功

### 方案 B: 自建 Gemini API 代理

如果您有自己的代理服务器，可以配置为：

```
模型名称: Gemini Pro (自建)
Base URL: https://your-proxy.example.com/v1
API Key: your-api-key
模型ID: gemini-pro
```

### 方案 C: 直接调用 Google Generative AI（✅ 已实现）

Google提供的原生API已在 `background.js` 中实现原生支持。代码会自动检测模型ID并调用相应的API。

#### 配置步骤

**1. 在模型配置页面添加新模型**
- 点击"添加自定义模型" 按钮

**2. 填写配置信息**

| 配置项 | 值 |
|--------|-----|
| 模型名称 | `Gemini Pro (Google原生)` |
| Base URL | `https://api.google.com` 或任意URL (不使用) |
| API Key | 您的 Google API Key |
| 模型ID | `gemini-pro` 、`gemini-1.5-pro` 、 `gemini-2.0-flash` 等 |

**3. 保存并激活**
- 点击"保存"按钮
- 在模型列表中选中该模型
- 系统会自动识别 `gemini-*` 前缀并调用Google原生API

#### 工作原理

代码修改已完成，自动检测逻辑：
```javascript
// background.js 中的 callAI() 函数会自动检测：
if (model && (model.toLowerCase().startsWith('gemini-') || model.toLowerCase().startsWith('gemini2.0'))) {
  return await callGeminiAPI(apiKey, model, prompt, mode);
}
```

检测到Gemini模型后，系统会：
1. 使用 Google Generative AI 官方 API 端点
2. 适配 Google API 的请求/响应格式
3. 处理 Google 特定的错误情况
4. 支持安全过滤检测

#### 支持的Gemini模型
- `gemini-pro` - Gemini Pro模型
- `gemini-1.5-pro` - Gemini 1.5 Pro
- `gemini-1.5-flash` - Gemini 1.5 Flash（推荐，更快更便宜）
- `gemini-2.0-flash` - Gemini 2.0 Flash（最新，性能最强）
- 其他更新的模型ID

---

## 🔑 获取API密钥

### 获取 Google API Key（用于Gemini原生API）

**步骤1**: 访问 Google AI Studio
```
https://aistudio.google.com/app/apikey
```

**步骤2**: 点击"Create API Key"
- 选择新建项目或选择现有项目
- 自动生成API Key

**步骤3**: 复制API Key
- 点击"Copy"按钮
- 保存到安全位置

**注意事项**:
- ⚠️ 不要在公开地方暴露API Key
- 一个项目最多可创建3个API Key
- 可以在Google Cloud Console中设置API调用限制

### 获取 OpenAI API Key（用于OpenAI或兼容服务）

**步骤1**: 访问 OpenAI官网
```
https://platform.openai.com/api-keys
```

**步骤2**: 登录账户并创建新密钥

**步骤3**: 复制密钥到本插件

---

| 服务 | Base URL示例 | 模型ID示例 | 优点 |
|------|-------------|---------|------|
| OpenAI官方 | `https://api.openai.com/v1` | `gpt-4o-mini` | 稳定可靠 |
| 国内转接 | `https://api.openai-hk.com/v1` | `gemini-2.0-flash` | 低延迟 |
| One API | `https://api.one-api.com/v1` | `gemini-pro` | 支持多模型 |
| 自建代理 | `https://your-domain.com/v1` | 取决于配置 | 完全控制 |

---

## 📝 配置示例

### 示例1：使用Google原生API配置 Gemini 2.0 Flash

```
✦ Gemini 2.0 Flash (Google原生)
  
  模型名称:
  └─ Gemini 2.0 Flash
  
  Base URL:
  └─ https://api.google.com (任意填写，不使用)
  
  API Key:
  └─ AIzaSy... (从Google AI Studio获取)
  
  模型ID:
  └─ gemini-2.0-flash
```

**优点**:
- ✅ 直连Google官方API，最稳定
- ✅ 响应速度快
- ✅ 模型版本最新

**缺点**:
- ❌ 国内需要代理或特殊网络
- ❌ 免费额度有限 (0-60 请求/分钟)

### 示例2：使用国内代理配置 Gemini 2.0 Flash

```
✦ Gemini 2.0 Flash (国内代理)
  
  模型名称:
  └─ Gemini 2.0 Flash
  
  Base URL:
  └─ https://api.openai-hk.com/v1
  
  API Key:
  └─ sk-****** (代理服务密钥)
  
  模型ID:
  └─ gemini-2.0-flash
```

**优点**:
- ✅ 国内可直接访问
- ✅ 无需配置代理
- ✅ 速度相对较快

**缺点**:
- ❌ 需要购买代理服务
- ❌ 依赖第三方服务稳定性

**验证步骤**:
1. 保存配置后，模型应该出现在模型列表
2. 点击选中作为活跃模型
3. 打开有题目的网页
4. 点击"扫描题目" - 如果没有错误说明配置正确
5. 可以开始自动答题

---

## ⚠️ 常见问题排查

### 问题1: API请求失败
**原因**: Base URL或API Key不正确
**解决**:
- 确认代理服务状态
- 验证API Key是否正确复制
- 检查Base URL是否以`/v1`结尾（或自动补全为`/chat/completions`）

### 问题2: 模型不返回答案
**原因**: 模型ID不匹配或API额度限制
**解决**:
- 确认使用的Gemini模型ID是否正确
- 验证API调用次数是否超限
- 查看浏览器控制台的错误信息

### 问题3: 页面无法识别题目
**原因**: 可能是AI分析失败，与模型配置关系不大
**解决**:
- 尝试切换到内置模型测试
- 使用更强大的模型（如 gemini-2.0-flash）
- 检查题目页面的HTML结构

---

## 🚀 性能建议

### 选择合适的模型
- **推荐用于自动答题**: `gemini-2.0-flash`（快速、经济）
- **推荐用于复杂分析**: `gemini-pro`（精准度高）
- **避免使用**: 过于复杂的模型（会增加延迟）

### 优化配置
1. 使用距离近的代理服务（降低延迟）
2. 选择更新的模型版本（更稳定）
3. 合理设置超时时间（避免卡顿）

---

## 📚 相关文件

- **UI层**: [popup.html](popup.html)
- **逻辑层**: [popup.js](popup.js)
- **API调用**: [background.js](background.js)
- **页面分析**: [modules/scanner-enhanced.js](modules/scanner-enhanced.js)

