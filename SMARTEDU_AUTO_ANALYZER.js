/**
 * 智慧教育平台 - 自动模板分析工具
 * 
 * 使用方法:
 * 1. 打开要分析的网页
 * 2. 按 F12 打开开发者工具
 * 3. 复制下方代码到 Console 中执行
 * 4. 根据输出结果生成完整的选择器
 */

// ============ 开始执行 ============

console.log('%c开始分析江苏智慧教育平台结构...', 'color: #4CAF50; font-size: 14px; font-weight: bold;');

// 1. 获取所有潜在的题目容器
console.log('\n%c[步骤1] 检测题目容器...', 'color: #2196F3; font-weight: bold;');

const commonContainerSelectors = [
  '.question-item',
  '.problem',
  '.question',
  '.item',
  '.exam-question',
  '[class*="question"]',
  '[class*="problem"]',
  '[class*="item"]',
];

let detectedContainers = {};
commonContainerSelectors.forEach(selector => {
  try {
    const count = document.querySelectorAll(selector).length;
    if (count > 0) {
      detectedContainers[selector] = count;
      console.log(`✓ 找到 ${count} 个: ${selector}`);
    }
  } catch (e) {
    console.log(`✗ 选择器无效: ${selector}`);
  }
});

// 2. 检测单选题
console.log('\n%c[步骤2] 检测单选题...', 'color: #2196F3; font-weight: bold;');

const radios = document.querySelectorAll('input[type="radio"]');
console.log(`找到 ${radios.length} 个单选按钮`);

if (radios.length > 0) {
  const firstRadio = radios[0];
  console.log('第一个单选按钮的容器结构:');
  
  let container = firstRadio;
  for (let i = 0; i < 5; i++) {
    container = container.parentElement;
    if (container) {
      console.log(`  ${'  '.repeat(i)}├─ <${container.tagName.toLowerCase()} class="${container.className}">`);
    }
  }
  
  // 分析单选题的选择器
  const radioContainers = new Set();
  radios.forEach(r => {
    const q = r.closest('[class*="question"], [class*="problem"], .item, [class*="question-item"]');
    if (q && q.className) {
      radioContainers.add(q.className.split(' ')[0]);
    }
  });
  
  console.log('单选题可能的容器类:', [...radioContainers].join(', '));
  
  // 单选题的题干
  const titleSelectors = ['.title', '.stem', '.question-stem', 'p', 'h3', 'h4', '[class*="stem"]'];
  console.log('\n单选题题干位置:');
  const singleQ = radios[0].closest('[class*="question"], [class*="problem"], .item, div');
  if (singleQ) {
    titleSelectors.forEach(sel => {
      const title = singleQ.querySelector(sel);
      if (title && title.textContent) {
        console.log(`  ✓ ${sel}: "${title.textContent.substring(0, 30)}..."`);
      }
    });
  }
}

// 3. 检测多选题
console.log('\n%c[步骤3] 检测多选题...', 'color: #2196F3; font-weight: bold;');

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
console.log(`找到 ${checkboxes.length} 个多选按钮`);

if (checkboxes.length > 0) {
  const checkboxContainers = new Set();
  checkboxes.forEach(c => {
    const q = c.closest('[class*="question"], [class*="problem"], .item, [class*="question-item"]');
    if (q && q.className) {
      checkboxContainers.add(q.className.split(' ')[0]);
    }
  });
  
  console.log('多选题可能的容器类:', [...checkboxContainers].join(', '));
}

// 4. 检测填空题
console.log('\n%c[步骤4] 检测填空题...', 'color: #2196F3; font-weight: bold;');

const textInputs = document.querySelectorAll('textarea, input[type="text"]');
console.log(`找到 ${textInputs.length} 个文本输入框`);

if (textInputs.length > 0) {
  const fillContainers = new Set();
  textInputs.forEach(t => {
    const q = t.closest('[class*="question"], [class*="problem"], .item, [class*="question-item"]');
    if (q && q.className) {
      fillContainers.add(q.className.split(' ')[0]);
    }
  });
  
  console.log('填空题可能的容器类:', [...fillContainers].join(', '));
}

// 5. 生成建议的选择器
console.log('\n%c[步骤5] 建议的选择器配置...', 'color: #2196F3; font-weight: bold;');

const bestContainer = Object.entries(detectedContainers).sort((a, b) => b[1] - a[1])[0];
console.log(`\n推荐的题目容器: ${bestContainer[0]} (${bestContainer[1]} 个题目)`);

// 6. 生成模板JSON
console.log('\n%c[结果] 推荐的模板配置:', 'color: #FF9800; font-weight: bold;');

const suggestedTemplate = {
  selectors: {
    questionContainer: bestContainer[0],
    questionTypes: {
      single: {
        container: `${bestContainer[0]}:has(input[type="radio"])`,
        title: '.title, .stem, .question-stem, p',
        optionInput: 'input[type="radio"]',
        clickTarget: 'input[type="radio"]'
      },
      multiple: {
        container: `${bestContainer[0]}:has(input[type="checkbox"])`,
        title: '.title, .stem, .question-stem, p',
        optionInput: 'input[type="checkbox"]',
        clickTarget: 'input[type="checkbox"]'
      },
      fill: {
        container: `${bestContainer[0]}:has(textarea, input[type="text"])`,
        title: '.title, .stem, .question-stem, p',
        inputs: 'textarea, input[type="text"]'
      }
    }
  }
};

console.log(JSON.stringify(suggestedTemplate, null, 2));

// 7. 详细的HTML结构分析
console.log('\n%c[详细分析] 前3个题目的HTML结构:', 'color: #9C27B0; font-weight: bold;');

const allQuestions = document.querySelectorAll(bestContainer[0]);
for (let i = 0; i < Math.min(3, allQuestions.length); i++) {
  const q = allQuestions[i];
  console.log(`\n第 ${i + 1} 个题目:`);
  console.log(`  HTML: ${q.outerHTML.substring(0, 200)}...`);
  
  const title = q.querySelector('p, .title, .stem, h3, h4');
  const radios = q.querySelectorAll('input[type="radio"]');
  const checkboxes = q.querySelectorAll('input[type="checkbox"]');
  const texts = q.querySelectorAll('textarea, input[type="text"]');
  
  console.log(`  题干: ${title ? title.textContent.substring(0, 50) : '未找到'}`);
  console.log(`  单选: ${radios.length} 个, 多选: ${checkboxes.length} 个, 填空: ${texts.length} 个`);
}

// 8. 复制建议
console.log('\n%c[建议] 后续步骤:', 'color: #F44336; font-weight: bold;');
console.log('1. 检查上面推荐的选择器是否正确');
console.log('2. 如果不正确，在Console中尝试调整选择器');
console.log('3. 将正确的选择器更新到 templates/smartedu.json 文件中');
console.log('4. 保存文件后重新加载扩展');
console.log('5. 在江苏智慧教育网站上测试扫描功能');

// 9. 提供快速测试函数
console.log('\n%c[测试] 复制以下代码到Console验证选择器:', 'color: #FF9800; font-weight: bold;');
console.log(`
// 验证题目容器选择器
console.log('题目总数:', document.querySelectorAll('${bestContainer[0]}').length);

// 验证单选题
console.log('单选题数:', document.querySelectorAll('${bestContainer[0]} input[type="radio"]').length);

// 验证多选题
console.log('多选题数:', document.querySelectorAll('${bestContainer[0]} input[type="checkbox"]').length);

// 验证填空题
console.log('填空题数:', document.querySelectorAll('${bestContainer[0]} textarea, ${bestContainer[0]} input[type="text"]').length);
`);

console.log('%c分析完成！', 'color: #4CAF50; font-size: 14px; font-weight: bold;');
