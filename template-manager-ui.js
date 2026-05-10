// Template Manager UI Script

document.addEventListener("DOMContentLoaded", async () => {
  console.log("[TemplateUI] 页面加载完成");

  // DOM元素
  const backBtn = document.getElementById("backBtn");
  const builtInList = document.getElementById("builtInList");
  const customList = document.getElementById("customList");
  const importBtn = document.getElementById("importTemplateBtn");
  const importInput = document.getElementById("importTemplateInput");

  // 初始化模板管理器
  await window.templateManager.init();

  // 加载模板列表
  await loadTemplates();

  // 事件监听
  backBtn.addEventListener("click", () => {
    window.location.href = "popup.html";
  });

  importBtn.addEventListener("click", () => {
    importInput.click();
  });

  importInput.addEventListener("change", async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    try {
      showLoading(`导入模板: ${file.name}`);
      await window.templateManager.importTemplate(file);
      showSuccess("模板导入成功");
      await loadTemplates();
    } catch (error) {
      showError("导入模板失败: " + error.message);
    } finally {
      hideLoading();
      importInput.value = "";
    }
  });

  // 加载模板列表
  async function loadTemplates() {
    try {
      const templates = await window.templateManager.getAllTemplates();

      const builtIn = templates.builtIn || [];
      const custom = templates.custom || [];

      renderTemplateList(builtInList, builtIn, false);
      renderTemplateList(customList, custom, true);
    } catch (error) {
      console.error("[TemplateUI] 加载模板失败:", error);
      showError("加载模板失败: " + error.message);
    }
  }

  // 渲染模板列表
  function renderTemplateList(container, templates, isCustom = false) {
    container.innerHTML = "";

    if (templates.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p>暂无${isCustom ? "自定义" : "内置"}模板</p>
        </div>
      `;
      return;
    }

    templates.forEach((template) => {
      const card = createTemplateCard(template, isCustom);
      container.appendChild(card);
    });
  }

  // 创建模板卡片
  function createTemplateCard(template, isCustom = false) {
    const card = document.createElement("div");
    card.className = "template-card";
    const badgeLabel = isCustom ? "自定义" : "内置";

    card.innerHTML = `
      <div class="template-header">
        <div class="template-info">
          <h3 class="template-name">
            ${template.siteName}
            <span class="template-badge">${badgeLabel}</span>
          </h3>
          <div class="template-meta">
            <span>版本: ${template.version || "N/A"}</span>
            <span>更新: ${template.lastUpdated || "N/A"}</span>
          </div>
        </div>
      </div>

      ${
        template.description
          ? `<p class="template-description">${template.description}</p>`
          : ""
      }

      <div class="template-urls">
        ${
          template.urlPatterns
            ? template.urlPatterns
                .map((url) => `<span class="url-tag">${url}</span>`)
                .join("")
            : ""
        }
      </div>
    `;

    return card;
  }

  // 工具函数
  function showLoading(message) {
    // 可以使用 layer.load() 或自定义loading
    console.log("[Loading]", message);
  }

  function hideLoading() {
    console.log("[Loading] Hide");
  }

  function showSuccess(message) {
    alert("✓ " + message);
  }

  function showError(message) {
    alert("✗ " + message);
  }
});
