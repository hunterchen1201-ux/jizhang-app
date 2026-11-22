(() => {
  const KEY = "jizhang.records.v1";
  let records = [];
  let selectedType = "支出";
  let editingId = null;
  const $ = id => document.getElementById(id);
  const amountInput = $("amount"), noteInput = $("note"), error = $("error");

  function load() {
    try { records = JSON.parse(localStorage.getItem(KEY) || "[]"); if (!Array.isArray(records)) records = []; }
    catch { records = []; }
  }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(records)); }
    catch { error.textContent = "無法儲存資料，請檢查 Safari 儲存空間設定。"; }
  }
  const money = n => new Intl.NumberFormat("zh-TW", {maximumFractionDigits:0}).format(n);
  function render() {
    const balance = records.reduce((sum,r) => sum + (r.type === "收入" ? r.amount : -r.amount), 0);
    $("balance").textContent = `NT$ ${money(balance)}`;
    $("record-count").textContent = `${records.length} 筆紀錄`;
    const root = $("records");
    if (!records.length) {
      root.innerHTML = '<div class="empty"><div class="empty-icon">↗</div><strong>還沒有任何紀錄</strong><span>新增第一筆收入或支出吧。</span></div>';
      return;
    }
    root.innerHTML = "";
    records.forEach(r => {
      const item = document.createElement("article");
      item.className = "record";
      const icon = document.createElement("div");
      icon.className = `record-icon ${r.type === "收入" ? "income" : "expense"}`;
      icon.textContent = r.type === "收入" ? "↙" : "↗";
      const main = document.createElement("div"); main.className = "record-main";
      const title = document.createElement("div"); title.className = "record-note"; title.textContent = r.note;
      const date = document.createElement("div"); date.className = "record-date"; date.textContent = new Date(r.createdAt).toLocaleString("zh-TW", {year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"});
      main.append(title,date);
      const right = document.createElement("div"); right.className = "record-right";
      const val = document.createElement("div"); val.className = `record-amount ${r.type === "收入" ? "income" : "expense"}`;
      val.textContent = `${r.type === "收入" ? "+" : "−"}${money(r.amount)}`;
      const actions = document.createElement("div"); actions.className = "record-actions";
      const edit = document.createElement("button"); edit.className = "small-action"; edit.textContent = "編輯"; edit.addEventListener("click", () => startEdit(r.id));
      const del = document.createElement("button"); del.className = "small-action"; del.textContent = "刪除"; del.addEventListener("click", () => removeRecord(r.id));
      actions.append(edit,del); right.append(val,actions); item.append(icon,main,right); root.append(item);
    });
  }
  function setType(type) {
    selectedType = type;
    document.querySelectorAll(".type-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.type === type));
    $("save").textContent = editingId ? "儲存修改" : `＋ 新增${type}`;
  }
  function resetForm() {
    editingId = null; amountInput.value = ""; noteInput.value = ""; error.textContent = "";
    $("form-title").textContent = "新增紀錄"; $("cancel-edit").classList.add("hidden");
    setType(selectedType);
  }
  function save() {
    const amount = Number(amountInput.value);
    const note = noteInput.value.trim();
    if (!Number.isFinite(amount) || amount <= 0) { error.textContent = "請輸入大於 0 的金額。"; amountInput.focus(); return; }
    if (!Number.isSafeInteger(Math.round(amount))) { error.textContent = "金額太大，請重新輸入。"; return; }
    const rounded = Math.round(amount);
    if (editingId !== null) {
      const old = records.find(r => r.id === editingId);
      if (old) { old.type = selectedType; old.amount = rounded; old.note = note || selectedType; }
    } else {
      records.unshift({id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()), type:selectedType, amount:rounded, note:note || selectedType, createdAt:Date.now()});
    }
    persist(); render(); resetForm();
  }
  function startEdit(id) {
    const r = records.find(x => x.id === id); if (!r) return;
    editingId = id; setType(r.type); amountInput.value = r.amount; noteInput.value = r.note;
    $("form-title").textContent = "編輯紀錄"; $("cancel-edit").classList.remove("hidden");
    error.textContent = ""; $("amount").focus(); window.scrollTo({top:0,behavior:"smooth"});
  }
  function removeRecord(id) {
    if (!confirm("確定要刪除這筆紀錄嗎？")) return;
    records = records.filter(r => r.id !== id);
    if (editingId === id) resetForm();
    persist(); render();
  }
  document.querySelectorAll(".type-btn").forEach(btn => btn.addEventListener("click", () => setType(btn.dataset.type)));
  $("save").addEventListener("click", save);
  $("cancel-edit").addEventListener("click", resetForm);
  amountInput.addEventListener("keydown", e => { if (e.key === "Enter") noteInput.focus(); });
  noteInput.addEventListener("keydown", e => { if (e.key === "Enter") save(); });
  load(); render(); setType("支出");
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(() => {}));
  }
})();
