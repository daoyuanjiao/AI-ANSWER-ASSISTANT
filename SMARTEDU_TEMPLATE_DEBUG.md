# 江苏智慧教育平台 - 模板调试指南

## 📋 概述

已为 `https://basic.jiangsu.smartedu.cn/cloudCourse/` 创建了基础模板文件：[templates/smartedu.json](templates/smartedu.json)

由于网站是动态渲染的SPA应用，需要通过浏览器开发工具精确化选择器。

---

## 🔍 如何优化模板

### 步骤1: 打开开发者工具

1. 访问网址: `https://basic.jiangsu.smartedu.cn/cloudCourse/syCompetition/#/practice/6`
2. 按 `F12` 打开开发者工具
3. 切换到 "Elements" 或 "Inspector" 标签

### 步骤2: 检查题目HTML结构

**对于单选题**:
```javascript
// 在Console中运行，查看单选题的HTML结构
document.querySelectorAll('input[type="radio"]').forEach(el => {
  console.log('单选题:', el.closest('[class*="question"], .question-item, .item'));
});
```

**对于多选题**:
```javascript
// 查看多选题的HTML结构
document.querySelectorAll('input[type="checkbox"]').forEach(el => {
  console.log('多选题:', el.closest('[class*="question"], .question-item, .item'));
});
```

**对于填空题**:
```javascript
// 查看填空题的HTML结构
document.querySelectorAll('textarea, input[type="text"]').forEach(el => {
  console.log('填空题:', el.closest('[class*="question"], .question-item, .item'));
});
```

### 步骤3: 右键检查元素

1. 右键点击题目 → "检查" (Inspect)
2. 观察HTML结构，记录：
   - **题目容器**: `class` 或 `id` 名称
   - **题干文本**: 在哪个元素中
   - **选项容器**: 包含所有选项的元素
   - **单个选项**: 每个选项的元素结构
   - **输入框**: type属性

**常见模式**:
```html
<!-- 可能的结构1: 标准容器 -->
<div class="question-item">
  <div class="question-stem">题干文本</div>
  <div class="options">
    <label>
      <input type="radio" />
      <span>选项A</span>
    </label>
  </div>
</div>

<!-- 可能的结构2: 表格式 -->
<div class="problem">
  <div class="title">题干文本</div>
  <div class="option-group">
    <div class="option-row">
      <input type="radio" />
      <span>选项A</span>
    </div>
  </div>
</div>

<!-- 可能的结构3: Vue组件 -->
<div v-if="question.type === 1" class="vue-question">
  <p v-text="question.stem"></p>
  <div v-for="option in question.options">
    <input type="radio" :value="option.id" />
    <span v-text="option.text"></span>
  </div>
</div>
```

### 步骤4: 提取精确的CSS选择器

在Console中测试选择器:

```javascript
// 测试题目容器选择器
console.log(document.querySelectorAll('YOUR_SELECTOR_HERE').length);

// 例如:
console.log(document.querySelectorAll('.question-item').length);  // 应该等于题目数量
console.log(document.querySelectorAll('.problem').length);

// 找到正确的选择器后，测试子选择器
document.querySelectorAll('.question-item').forEach(q => {
  console.log('题干:', q.querySelector('.question-stem, .title, .stem')?.textContent);
  console.log('选项:', q.querySelectorAll('input[type="radio"]').length);
});
```

### 步骤5: 更新模板文件

根据实际的HTML结构，更新 [templates/smartedu.json](templates/smartedu.json):

```json
{
  "selectors": {
    "questionContainer": "你发现的题目容器选择器",
    "questionTypes": {
      "single": {
        "container": "单选题容器的选择器",
        "title": "题干文本所在元素的选择器",
        "optionInput": "input[type='radio']",
        "clickTarget": "input[type='radio']"
      },
      "multiple": {
        "container": "多选题容器的选择器",
        "title": "题干文本所在元素的选择器",
        "optionInput": "input[type='checkbox']",
        "clickTarget": "input[type='checkbox']"
      },
      "fill": {
        "container": "填空题容器的选择器",
        "title": "题干文本所在元素的选择器",
        "inputs": "textarea, input[type='text']"
      }
    }
  }
}
```

---

## 🧪 测试调试

### 测试1: 在扩展中测试

1. 访问江苏智慧教育网站
2. 在扩展中设置Gemini或其他模型
3. 点击"扫描页面题目"
4. 观察日志：
   - ✅ "已匹配到站点模板: 江苏智慧教育"
   - ✅ "发现 X 道题目"
   - ❌ "模板扫描失败，回退到AI分析" (选择器不正确)

### 测试2: Console调试

```javascript
// 在Console中直接测试扫描逻辑
const template = {
  selectors: {
    questionContainer: "你的选择器",
    questionTypes: {
      single: { container: "选择器", optionInput: "input[type='radio']" }
    }
  }
};

// 模拟扫描
const questions = document.querySelectorAll(template.selectors.questionContainer);
console.log('找到的题目:', questions.length);

// 检查各题型
questions.forEach((q, idx) => {
  const radios = q.querySelectorAll('input[type="radio"]').length;
  const checkboxes = q.querySelectorAll('input[type="checkbox"]').length;
  const texts = q.querySelectorAll('textarea, input[type="text"]').length;
  
  console.log(`题目${idx + 1}: 单选${radios}个, 多选${checkboxes}个, 填空${texts}个`);
});
```

---

## 📊 常见问题

### 问题1: "模板扫描失败"
**原因**: 选择器不匹配

**排查**:
```javascript
// 检查题目容器选择器
const container = document.querySelector('YOUR_SELECTOR');
console.log(container);  // 应该返回一个元素，不是null
```

### 问题2: 识别到题目但没有选项
**原因**: 选项容器或输入框选择器不正确

**排查**:
```javascript
// 检查单个题目
const q = document.querySelector('YOUR_QUESTION_SELECTOR');
console.log('单选按钮:', q.querySelectorAll('input[type="radio"]').length);
console.log('多选按钮:', q.querySelectorAll('input[type="checkbox"]').length);
```

### 问题3: 无法获取题干文本
**原因**: 题干选择器错误

**排查**:
```javascript
const q = document.querySelector('YOUR_QUESTION_SELECTOR');
console.log('题干文本:', q.querySelector('YOUR_TITLE_SELECTOR')?.textContent);

// 如果不确定，尝试这些通用选择器
console.log('可能的题干:', 
  q.querySelector('.title')?.textContent ||
  q.querySelector('.stem')?.textContent ||
  q.querySelector('p')?.textContent ||
  q.textContent.substring(0, 100)
);
```

---

## 🔧 高级技巧

### 动态内容处理

如果题目通过JavaScript动态生成：

```javascript
// 等待页面加载完成
setTimeout(() => {
  const count = document.querySelectorAll('YOUR_SELECTOR').length;
  console.log('加载完成，找到', count, '道题目');
}, 1000);  // 等待1秒
```

在模板中设置等待时间：
```json
{
  "hints": {
    "needsWait": 1000,  // 等待毫秒数
    "scrolling": true   // 需要滚动加载
  }
}
```

### 处理Iframe

如果题目在iframe中：

```javascript
// 检查是否有iframe
const iframes = document.querySelectorAll('iframe');
console.log('Iframe数量:', iframes.length);

// 访问iframe内的元素
iframes.forEach(iframe => {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    console.log('Iframe内的题目:', doc.querySelectorAll('YOUR_SELECTOR').length);
  } catch (e) {
    console.log('无法访问iframe:', e.message);  // 可能是跨域
  }
});
```

---

## 📝 生成的基础模板

当前模板文件: [templates/smartedu.json](templates/smartedu.json)

**状态**: ⚠️ 需要精确化

**下一步**:
1. 按照上述步骤分析实际HTML
2. 更新模板中的CSS选择器
3. 测试并验证
4. 分享给其他用户使用

---

## 💾 验证清单

完成以下检查后，模板即可投入使用：

- [ ] `questionContainer` 选择器能找到所有题目
- [ ] `single.title` 能正确提取单选题题干
- [ ] `single.optionInput` 找到所有单选按钮
- [ ] `multiple.title` 能正确提取多选题题干
- [ ] `multiple.optionInput` 找到所有多选按钮
- [ ] `fill.inputs` 找到所有填空框
- [ ] 扩展能识别所有题型
- [ ] 自动答题能正常工作

---

## 🆘 需要帮助？

如果你卡住了，可以：

1. 在Console中运行上述命令记录输出
2. 截图或复制HTML结构
3. 更新模板文件中的选择器
4. 在扩展中再次测试

**完成后的模板将自动加载，无需重启扩展！**

