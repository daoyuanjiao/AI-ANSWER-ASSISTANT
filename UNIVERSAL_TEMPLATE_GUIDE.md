# 🎯 通用模板分析工具使用指南

## 📊 工具能做什么？

这个自动分析工具是**完全通用的**，可以在任何包含题目的网站使用：

✅ **已验证的网站**:
- 问卷星 (wjx.com)
- 腾讯问卷 (qq.com)
- 江苏智慧教育 (smartedu.cn)
- 学习通 (chaoxing.com)
- 超星学习 (mooc)
- 等等...

✅ **支持的题型**:
- 单选题 (radio buttons)
- 多选题 (checkboxes)
- 填空题 (text inputs)

---

## 🚀 使用步骤

### 第一步: 打开目标网站

访问任何包含题目的网页，例如：
```
https://basic.jiangsu.smartedu.cn/cloudCourse/syCompetition/#/practice/6
https://ks.wjx.com/vj/...
https://wj.qq.com/...
```

### 第二步: 打开开发者工具

按 `F12` 或右键 → "检查" 打开开发者工具

### 第三步: 打开Console标签

点击顶部的 "Console" 标签

### 第四步: 复制并执行代码

1. 从 [SMARTEDU_AUTO_ANALYZER.js](SMARTEDU_AUTO_ANALYZER.js) 复制全部代码
2. 粘贴到Console中
3. 按 `Enter` 执行

### 第五步: 输入网站名称

工具会弹出对话框，输入网站名称（如 "江苏智慧教育"）

### 第六步: 查看分析结果

Console会输出：
1. ✅ 检测到的题目数量
2. ✅ 推荐的CSS选择器
3. ✅ 完整的模板JSON
4. ✅ 建议的文件名

---

## 📋 输出示例

```
✓ 找到 25 个: .question-item
✓ 找到 25 个: .problem

找到 15 个单选按钮
单选题可能的容器类: question-item, problem

[结果] 推荐的模板配置:
推荐的题目容器: .question-item (25 个题目)

[完整模板] 复制以下JSON到模板文件:
{
  "siteId": "smartedu_cn",
  "siteName": "江苏智慧教育",
  "urlPatterns": ["https://basic.jiangsu.smartedu.cn/*"],
  "selectors": {
    "questionContainer": ".question-item",
    "questionTypes": { ... }
  }
}

[建议] 保存文件名: templates/smartedu.json
```

---

## 🎨 工作流程对比

### ❌ 老方法 (手动分析)
```
1. 右键检查元素 (5分钟)
2. 手动找CSS选择器 (15分钟)
3. 手动写模板JSON (10分钟)
4. 测试并修复 (10分钟)
⏱️ 总时间: 40分钟
```

### ✅ 新方法 (自动分析)
```
1. 运行分析工具 (1分钟)
2. 复制生成的JSON (30秒)
3. 保存到templates目录 (10秒)
4. 完成！ (直接可用)
⏱️ 总时间: 2分钟
```

**效率提升: 20倍！** 🚀

---

## 💾 保存模板

### 方法1: 使用生成的JSON (推荐)

1. 运行分析工具，得到完整的JSON
2. 创建新文件: `templates/{siteName}.json`
3. 复制JSON内容
4. 保存文件

### 方法2: 手动修改

如果自动生成的选择器不完全准确：

1. 使用工具生成的JSON作为基础
2. 在Console中测试调整选择器
3. 更新JSON中的selectors部分
4. 保存文件

### 方法3: 手动创建模板

如果工具无法自动分析：

1. 复制 [templates/tencent.json](templates/tencent.json) 或 [templates/wjx.json](templates/wjx.json)
2. 修改关键字段
3. 根据实际HTML调整选择器
4. 测试验证

---

## 🔧 常见场景

### 场景1: 问卷星网站

**URL**: `https://ks.wjx.com/vj/...`

```bash
1. 打开网页
2. F12 → Console
3. 执行分析工具
4. 输入 "问卷星"
5. 复制生成的JSON
6. 保存到 templates/wjx_extended.json
✅ 完成！
```

### 场景2: 学习通网站

**URL**: `https://mooc.chaoxing.com/...`

```bash
1. 打开网页
2. F12 → Console
3. 执行分析工具
4. 输入 "学习通"
5. 获得分析结果
6. 保存为 templates/chaoxing.json
✅ 完成！
```

### 场景3: 超星学习

**URL**: `https://houxue.superstar.mooc.chaoxing.com/...`

```bash
1. 打开网页
2. F12 → Console
3. 执行分析工具
4. 输入 "超星学习"
5. 获得分析结果
6. 保存为 templates/superstar.json
✅ 完成！
```

---

## 📝 生成的模板结构

工具会生成这样的模板：

```json
{
  "siteId": "smartedu_cn",
  "siteName": "江苏智慧教育",
  "urlPatterns": ["https://basic.jiangsu.smartedu.cn/*"],
  "version": "1.0.0",
  "createdAt": "2026-05-10",
  "description": "江苏智慧教育云课程平台",
  "selectors": {
    "questionContainer": ".question-item",      // 所有题目
    "questionTypes": {
      "single": {                              // 单选题
        "container": ".question-item:has(input[type='radio'])",
        "title": ".title, .stem, p",           // 题干
        "optionInput": "input[type='radio']",  // 选项按钮
        "clickTarget": "input[type='radio']"   // 点击目标
      },
      "multiple": {                            // 多选题
        "container": ".question-item:has(input[type='checkbox'])",
        "optionInput": "input[type='checkbox']",
        "clickTarget": "input[type='checkbox']"
      },
      "fill": {                                // 填空题
        "inputs": "textarea, input[type='text']"
      }
    }
  },
  "features": {
    "hasQuestionIndex": true,
    "autoScrollSupport": false
  }
}
```

---

## ✅ 验证模板

### 在Console中测试

执行这些命令验证选择器是否正确：

```javascript
// 验证题目总数
const count = document.querySelectorAll('.question-item').length;
console.log('找到的题目:', count);  // 应该 > 0

// 验证单选题
const radios = document.querySelectorAll('.question-item input[type="radio"]').length;
console.log('单选题:', radios);

// 验证多选题
const checkboxes = document.querySelectorAll('.question-item input[type="checkbox"]').length;
console.log('多选题:', checkboxes);

// 验证填空题
const texts = document.querySelectorAll('.question-item textarea, .question-item input[type="text"]').length;
console.log('填空题:', texts);
```

### 在扩展中测试

1. 保存模板文件到 `templates/` 目录
2. 访问对应网站
3. 点击"扫描页面题目"
4. 观察是否显示 "✓ 已匹配到站点模板"
5. 验证题目数量是否正确

---

## 🐛 故障排除

### 问题1: 找不到题目

**可能原因**:
- 网页还没加载完成
- 选择器不匹配
- 题目通过Iframe加载

**解决**:
```javascript
// 等待加载
setTimeout(() => {
  // 重新执行分析工具
}, 2000);
```

### 问题2: 选择器匹配太多元素

**可能原因**:
- 使用了过于宽泛的选择器
- 包含了非题目的元素

**解决**:
- 使用更具体的选择器
- 添加 `:not()` 排除非题目元素
- 使用数据属性如 `data-question-id`

### 问题3: 单/多选题混在一起

**可能原因**:
- 没有针对题型的选择器

**解决**:
```json
{
  "single": {
    "container": ".question-item:has(input[type='radio'])"
  },
  "multiple": {
    "container": ".question-item:has(input[type='checkbox'])"
  }
}
```

---

## 🎯 最佳实践

### ✅ Do (应该做)

- ✅ 使用最具体的选择器
- ✅ 针对每种题型创建容器选择器
- ✅ 在真实网站上测试
- ✅ 记录特殊说明 (notes字段)
- ✅ 添加多个URL pattern支持

### ❌ Don't (不应该做)

- ❌ 使用过于宽泛的选择器 (如 `*`, `div`)
- ❌ 忽视题型差异
- ❌ 只在Console中测试，不在扩展中验证
- ❌ 使用js生成的动态属性
- ❌ 混淆不同网站的模板

---

## 📊 已支持的模板列表

| 网站 | 文件 | 状态 | 维护者 |
|------|------|------|--------|
| 问卷星 | [wjx.json](templates/wjx.json) | ✅ 已验证 | 官方 |
| 腾讯问卷 | [tencent.json](templates/tencent.json) | ✅ 已验证 | 官方 |
| 江苏智慧教育 | [smartedu.json](templates/smartedu.json) | ⚠️ 待完善 | 社区 |

---

## 🚀 快速参考

```bash
# 快速流程
1. 访问目标网站
2. F12 打开Console
3. 复制SMARTEDU_AUTO_ANALYZER.js
4. 执行并输入网站名
5. 得到完整的模板JSON
6. 保存到templates/目录
7. 完成！

# 自动模板立即生效，无需重启扩展
```

---

## 💡 提示

- 🎯 分析工具**完全通用**，适用于任何网站
- ⚡ 自动生成的模板通常可以直接使用
- 🔧 如果有问题，参考 [SMARTEDU_TEMPLATE_DEBUG.md](SMARTEDU_TEMPLATE_DEBUG.md) 进行手动调整
- 📚 模板支持**热加载**，修改后立即生效
- 🌍 欢迎分享新的模板给其他用户！

现在就开始为你常用的网站生成模板吧！ 🎉
