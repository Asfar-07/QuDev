 let surveyFun = {
      name: () => String(document.getElementById('sd-name-display').textContent.trim()),
      description: () => String(document.getElementById('sd-desc-display').textContent.trim()),
      status: () => String(document.getElementById('sd-status-display').textContent.split("●")[1].trim().toLocaleLowerCase()),
    };
    let surveyDetail = {
      name: surveyFun.name(),
      description: surveyFun.description(),
      status: surveyFun.status()
      ,
    };

    let questions = collectQuestions();

    const TYPE_OPTS = ['SINGLE', 'MULTIPLE', 'DROPDOWN', 'TEXT', 'SCALE', 'BOOLEAN'];
    const NULL_TYPES = ['TEXT', 'SCALE'];
    const BOOL_TYPE = 'BOOLEAN';


    function collectQuestions() {
      const cards = document.querySelectorAll('#questions-list .q-card');

      const questions = Array.from(cards).map((card, index) => {

        // Question text
        const questionText = card.querySelector('.q-text-display')?.textContent.trim();

        // Type
        const type = card.querySelector('.q-type-badge')?.textContent.trim();
        const id = card.querySelector('.q-id-display')?.textContent.trim();

        // Required
        const required = !!card.querySelector('.q-req-badge');

        // Question key (from pill: "key: something")
        const keyText = card.querySelector('.q-meta-pill:nth-child(1)')?.textContent;
        const questionKey = keyText ? keyText.replace('key:', '').trim() : null;

        // Options
        const optionNodes = card.querySelectorAll('.q-option');

        let options = null;
        if (optionNodes.length > 0) {
          options = Array.from(optionNodes).map(opt => {
            const fullText = opt.textContent.trim();

            const keyEl = opt.querySelector('span');
            const key = keyEl ? keyEl.textContent.trim() : null;

            // label = text without key
            const label = key ? fullText.replace(key, '').trim() : fullText;

            return { key, label };
          });
        }

        return {
          id,
          questionKey,
          questionText,
          type,
          required,
          options
        };
      });

      return questions;
    }

      //  SURVEY DETAIL MODAL
   
    function openSurveyDetailModal() {
      document.getElementById('sd-name-input').value = surveyDetail.name;
      document.getElementById('sd-desc-input').value = surveyDetail.description;
      document.getElementById('sd-status-input').value = surveyDetail.status;
      document.getElementById('sd-overlay').classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeSurveyDetailModal() {
      document.getElementById('sd-overlay').classList.remove('open');
      document.body.style.overflow = '';
    }
    function handleSdOverlayClick(e) {
      if (e.target === document.getElementById('sd-overlay')) closeSurveyDetailModal();
    }
    async function saveSurveyDetail(btn) {
      surveyDetail.name = document.getElementById('sd-name-input').value.trim() || surveyDetail.name;
      surveyDetail.description = document.getElementById('sd-desc-input').value.trim();
      surveyDetail.status = document.getElementById('sd-status-input').value;
      btn.disabled = true;
      function status(value) {
        if (value === "active") {
          return true;
        } else {
          return false;
        }
      }
      const UpdateSurvey = {
        name: surveyDetail.name,
        description: surveyDetail.description,
        active: status(surveyDetail.status)
      }
      const path = window.location.pathname;
      const segments = path.split('/').filter(Boolean); // Filter removes empty strings from trailing slashes
      try {
        const res = await fetch(`/update/survey/${segments[1]}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(UpdateSurvey),
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        document.getElementById('sd-name-display').textContent = surveyDetail.name;
        document.getElementById('sd-desc-display').textContent = surveyDetail.description || '—';
        const statusEl = document.getElementById('sd-status-display');
        const statusMap = { 2: '● Active', inactive: '● Deactive', draft: '● Draft' };
        const colorMap = { active: '#4ade80', inactive: '#9ca3af', draft: '#fbbf24' };
        statusEl.textContent = statusMap[surveyDetail.status];
        statusEl.style.color = colorMap[surveyDetail.status];
        document.getElementById('page-subtitle').textContent = `${surveyDetail.name} · Add and manage your questions`;
        btn.disabled = false;
        btn.textContent = "Save Changes"
        closeSurveyDetailModal();

      } catch (err) {

        btn.disabled = false;
        btn.textContent = "Save Changes"
        // On error: restore previous text & state, show brief red flash
        console.error("Toggle failed:", err);
      } finally {
        btn.textContent = "Saving..."
      }
    }


      //  ADD-FORM helpers

    function addOptionRow(key = '', label = '') {
      const list = document.getElementById('option-rows-list');
      const row = document.createElement('div');
      row.className = 'option-row-item';
      row.innerHTML = `<input type="text" placeholder="e.g. social_media" value="${esc(key)}" oninput="autoFillLabel(this)"/>
    <input type="text" placeholder="e.g. Social Media" value="${esc(label)}"/>
    <button type="button" class="option-row-del" onclick="removeOptionRow(this)">×</button>`;
      list.appendChild(row);
      row.querySelector('input').focus();
    }
    function removeOptionRow(btn) { btn.closest('.option-row-item').remove(); }
    function autoFillLabel(inp) {
      const lbl = inp.nextElementSibling;
      if (!lbl.dataset.ue) lbl.value = inp.value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
    document.addEventListener('input', e => {
      if (e.target.matches('.option-row-item input:nth-child(2)')) e.target.dataset.ue = e.target.value ? '1' : '';
    });
    function resetOptionRows() {
      document.getElementById('option-rows-list').innerHTML = '';
      // addOptionRow('option_a', 'Option A');
      // addOptionRow('option_b', 'Option B');
    }
    function readOptionRows() {
      return [...document.querySelectorAll('#option-rows-list .option-row-item')]
        .map(r => { const i = r.querySelectorAll('input'); return { key: i[0].value.trim(), label: i[1].value.trim() }; })
        .filter(o => o.key || o.label);
    }
    function handleTypeChange() {
      const t = document.getElementById('q-type').value;
      ['chips', 'yesno', 'scale', 'text'].forEach(id => document.getElementById(`options-${id}-block`).style.display = 'none');
      if (t === 'boolean') document.getElementById('options-yesno-block').style.display = 'block';
      else if (t === 'scale') document.getElementById('options-scale-block').style.display = 'block';
      else if (t === 'text') document.getElementById('options-text-block').style.display = 'block';
      else document.getElementById('options-chips-block').style.display = 'block';
    }
    function resolveFormOptions(type) {
      if (type === 'text' || type === 'scale') return null;
      if (type === 'boolean') return [{ key: 'yes', label: 'Yes' }, { key: 'no', label: 'No' }];
      const rows = readOptionRows();
      return rows.length ? rows : null;
    }


      //  ADD QUESTION

    async function addQuestion() {
      const qText = document.getElementById('q-input').value.trim();
      const qKey = document.getElementById('q-key').value.trim();
      const typeEl = document.getElementById('q-type');
      const type = typeEl.value;
      const required = document.getElementById('q-required').value === 'yes';
      const options = resolveFormOptions(type);
      const order = document.querySelectorAll('#questions-list .q-card').length + 1;

      if (!qText) { document.getElementById('q-input').focus(); showFeedback('error', 'Question text is required.'); return; }
      if (!qKey) { document.getElementById('q-key').focus(); showFeedback('error', 'Question key is required.'); return; }
      if (['single', 'multiple', 'dropdown'].includes(type)) {
        const rows = readOptionRows(), bad = rows.find(r => !r.key || !r.label);
        if (bad || !rows.length) { showFeedback('error', 'Each option needs a key and a label.'); return; }
      }

      const payload = { questionKey: qKey, questionText: qText, type: type.toUpperCase(), required, options, order };
      const btn = document.querySelector('.add-form .btn-primary');
      btn.disabled = true; btn.textContent = 'Saving…';
      const path = window.location.pathname;
      const segments = path.split('/').filter(Boolean); // Filter removes empty strings from trailing slashes
      const lastParam = segments.pop()
      console.log(payload)
      try {
        const res = await fetch(`/new/question/${lastParam}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(`Server ${res.status}`);
        questions.push(payload);
        renderCard(payload);
        resetForm();
        showFeedback('success', `"${qText}" added.`);
      } catch (e) { console.error(e); showFeedback('error', `Failed: ${e.message}`); }
      finally { btn.disabled = false; btn.textContent = '+ Add'; }
    }
    function resetForm() {
      document.getElementById('q-input').value = '';
      document.getElementById('q-key').value = '';
      document.getElementById('q-type').value = 'single';
      document.getElementById('q-required').value = 'yes';
      resetOptionRows(); handleTypeChange();
    }

      //  RENDER read-only card

    function renderCard(q, num) {
      const idx = num ?? document.querySelectorAll('#questions-list .q-card').length + 1;
      const optHTML = q.options?.length
        ? `<div class="q-card-options">${q.options.map(o => `<span class="q-option">${o.label} <span style="opacity:.38;font-size:10px;">${o.key}</span></span>`).join('')}</div>`
        : '';
      const card = document.createElement('div');
      card.className = 'q-card';
      card.style.animation = 'fadeUp 0.3s ease forwards';
      card.innerHTML = `
        <div class="q-card-header">
          <div><div class="q-num">Q${idx}</div><div class="q-text-display">${esc(q.questionText)}</div></div>
          <div class="q-meta-col">
            <span class="q-type-badge">${q.type}</span>
            ${q.required ? '<span class="q-req-badge">Required</span>' : ''}
          </div>
        </div>
        ${optHTML}
        <div class="q-card-actions">
          <div class="q-meta-pills">
            <span class="q-meta-pill">key: ${q.questionKey}</span>
            <span class="q-meta-pill">order: ${idx}</span>
            <span class="q-meta-pill">options: ${q.options ? q.options.length : 'null'}</span>
            <span class="q-meta-pill">Id: <span  class="q-id-display">${q.id}</span></span>
          </div>
          <button class="q-edit-btn" onclick="openEditor()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit All Questions
          </button>
        </div>`;
      document.getElementById('questions-list').appendChild(card);
      document.getElementById('q-count').textContent = `${document.querySelectorAll('#questions-list .q-card').length} Qs`;
    }
    function rebuildList() {
      document.getElementById('questions-list').innerHTML = '';
      questions.forEach((q, i) => renderCard(q, i + 1));
      document.getElementById('q-count').textContent = `${questions.length} Qs`;
    }


      //  EDITOR — open / close

    function openEditor() {
      const ver = document.getElementById('survey-version');
      document.getElementById('editor-subtitle').textContent = `${surveyDetail.name} · ${ver.options[ver.selectedIndex].text}`;
      buildEditorBody();
      document.getElementById('editor-overlay').classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeEditor() {
      document.getElementById('editor-overlay').classList.remove('open');
      document.body.style.overflow = '';
    }
    function handleEditorOverlayClick(e) { if (e.target === document.getElementById('editor-overlay')) closeEditor(); }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeEditor(); closeSurveyDetailModal(); } });

      //  BUILD editor body
  
    function buildEditorBody() {
      const body = document.getElementById('editor-body');
      body.innerHTML = '';
      questions.forEach((q, i) => body.appendChild(buildEqCard(q, i)));
      initDrag();
    }

    function buildEqCard(q, idx) {
      const card = document.createElement('div');
      card.className = 'eq-card';
      card.dataset.idx = idx;
      card.draggable = true;

      // Read-only view pills
      const viewOpts = q.options?.length
        ? `<div class="eq-view-options">${q.options.map(o => `<span class="eq-view-opt">${o.label} <span style="opacity:.4;font-size:9px;">${o.key}</span></span>`).join('')}</div>`
        : (q.options === null ? `<span style="font-size:11px;color:var(--text-dim);font-style:italic;">No options (${q.type})</span>` : '');

      // Edit area inputs
      const typeSelect = TYPE_OPTS.map(t => `<option value="${t}"${q.type === t ? ' selected' : ''}>${t}</option>`).join('');
      const editOptArea = buildEqOptions(q);

      card.innerHTML = `
    <div class="deleted-banner">
      <span>⚠ Will be deleted on save</span>
      <button class="undo-btn" onclick="undoDelete(this)">Undo</button>
    </div>

    <div class="eq-header">
      <span class="eq-drag-handle" title="Drag to reorder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="9" y1="6" x2="15" y2="6"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/></svg>
      </span>
      <span class="eq-order">Q${idx + 1}</span>
      <div class="eq-header-actions">
        <button class="eq-icon-btn" title="Edit this question" onclick="toggleEditArea(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="eq-icon-btn del" title="Delete question" onclick="markDeleted(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
    </div>

    <!-- VIEW (read-only) -->
    <div class="eq-view">
      <div class="eq-view-text">${esc(q.questionText)}</div>
      <div class="eq-view-meta">
        <span class="eq-badge eq-badge-type">${q.type}</span>
        ${q.required ? '<span class="eq-badge eq-badge-req">Required</span>' : ''}
      </div>
      ${viewOpts}
    </div>

    <!-- EDIT AREA (hidden until pencil clicked) -->
    <div class="eq-edit-area">
      <div>
        <label class="eq-field-label">Question Text</label>
        <input class="input-field eq-text" style="font-size:13px;" value="${esc(q.questionText)}" placeholder="Question text"/>
      </div>
      <div class="eq-row2">
        <div>
          <label class="eq-field-label">Type</label>
          <select class="input-field select-field eq-type" style="font-size:12px;" onchange="onEqTypeChange(this)">${typeSelect}</select>
        </div>
        <div>
          <label class="eq-field-label">Required</label>
          <select class="input-field select-field eq-required" style="font-size:12px;">
            <option value="yes"${q.required ? ' selected' : ''}>Yes</option>
            <option value="no"${!q.required ? ' selected' : ''}>No</option>
          </select>
        </div>
      </div>
      <div class="eq-options-area">${editOptArea}</div>
      <div class="eq-confirm-row">
        <button class="eq-cancel-btn" onclick="cancelEdit(this)">Cancel</button>
        <button class="eq-confirm-btn" onclick="confirmEdit(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
          Confirm Changes
        </button>
      </div>
    </div>`;

      return card;
    }

    /* ── TOGGLE EDIT AREA ── */
    function toggleEditArea(btn) {
      const card = btn.closest('.eq-card');
      const editArea = card.querySelector('.eq-edit-area');
      const isOpen = editArea.classList.contains('open');
      // Close all other open edit areas first
      document.querySelectorAll('.eq-edit-area.open').forEach(a => a.classList.remove('open'));
      if (!isOpen) editArea.classList.add('open');
    }

    function cancelEdit(btn) {
      btn.closest('.eq-edit-area').classList.remove('open');
    }

    /* ── CONFIRM EDIT — update view section ── */
    function confirmEdit(btn) {
      const card = btn.closest('.eq-card');
      const editArea = card.querySelector('.eq-edit-area');
      const view = card.querySelector('.eq-view');

      const newText = card.querySelector('.eq-text').value.trim();
      const newType = card.querySelector('.eq-type').value;
      const newRequired = card.querySelector('.eq-required').value === 'yes';

      // Read updated options from edit area
      let newOptions = null;
      if (!NULL_TYPES.includes(newType) && newType !== BOOL_TYPE) {
        const rows = [...card.querySelectorAll('.eq-opt-row')].map(r => {
          const ins = r.querySelectorAll('input');
          return { key: ins[0].value.trim(), label: ins[1].value.trim() };
        }).filter(o => o.key || o.label);
        newOptions = rows.length ? rows : null;
      } else if (newType === BOOL_TYPE) {
        newOptions = [{ key: 'yes', label: 'Yes' }, { key: 'no', label: 'No' }];
      }

      if (!newText) { card.querySelector('.eq-text').focus(); return; }

      // Update the view section
      view.querySelector('.eq-view-text').textContent = newText;

      const metaDiv = view.querySelector('.eq-view-meta');
      metaDiv.innerHTML = `<span class="eq-badge eq-badge-type">${newType}</span>
    ${newRequired ? '<span class="eq-badge eq-badge-req">Required</span>' : ''}`;

      // Update or create options area in view
      let optsDiv = view.querySelector('.eq-view-options');
      if (newOptions?.length) {
        const pills = newOptions.map(o => `<span class="eq-view-opt">${o.label} <span style="opacity:.4;font-size:9px;">${o.key}</span></span>`).join('');
        if (!optsDiv) { optsDiv = document.createElement('div'); optsDiv.className = 'eq-view-options'; view.appendChild(optsDiv); }
        optsDiv.innerHTML = pills;
      } else if (optsDiv) {
        optsDiv.remove();
      }

      // Store updated data on card for later harvest
      card.dataset.qText = newText;
      card.dataset.qType = newType;
      card.dataset.qRequired = newRequired;
      card.dataset.qOptions = JSON.stringify(newOptions);

      editArea.classList.remove('open');
    }

    /* ── EDITOR OPTION ROWS ── */
    function buildEqOptions(q) {
      const t = q.type;
      if (NULL_TYPES.includes(t))
        return `<div class="eq-notice">No options for <strong>${t}</strong> — handled automatically.</div>`;
      if (t === BOOL_TYPE)
        return `<div class="eq-option-rows-wrap" style="opacity:.6;pointer-events:none;">
      <div class="eq-opt-header"><span>Key</span><span>Label</span><span></span></div>
      <div class="eq-opt-row"><input value="yes" readonly/><input value="Yes" readonly/><button class="eq-opt-del" disabled>×</button></div>
      <div class="eq-opt-row"><input value="no" readonly/><input value="No" readonly/><button class="eq-opt-del" disabled>×</button></div>
    </div>`;
      const rows = (q.options || [{ key: '', label: '' }]).map(o => `
    <div class="eq-opt-row">
      <input type="text" value="${esc(o.key)}" placeholder="option_key" oninput="eqAutoLabel(this)"/>
      <input type="text" value="${esc(o.label)}" placeholder="Label"/>
      <button class="eq-opt-del" onclick="this.closest('.eq-opt-row').remove()">×</button>
    </div>`).join('');
      return `<div class="eq-option-rows-wrap">
    <div class="eq-opt-header"><span>Key</span><span>Label</span><span></span></div>
    ${rows}
    <button type="button" class="eq-opt-add" onclick="addEqOptRow(this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Add option
    </button>
  </div>`;
    }

    function eqAutoLabel(inp) {
      const lbl = inp.nextElementSibling;
      if (!lbl.dataset.ue) lbl.value = inp.value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
    document.addEventListener('input', e => {
      if (e.target.matches('.eq-opt-row input:nth-child(2)')) e.target.dataset.ue = e.target.value ? '1' : '';
    });
    function addEqOptRow(btn) {
      const wrap = btn.closest('.eq-option-rows-wrap');
      const row = document.createElement('div');
      row.className = 'eq-opt-row';
      row.innerHTML = `<input type="text" placeholder="option_key" oninput="eqAutoLabel(this)"/>
    <input type="text" placeholder="Label"/>
    <button class="eq-opt-del" onclick="this.closest('.eq-opt-row').remove()">×</button>`;
      wrap.insertBefore(row, btn);
      row.querySelector('input').focus();
    }
    function onEqTypeChange(sel) {
      const area = sel.closest('.eq-card').querySelector('.eq-options-area');
      area.innerHTML = buildEqOptions({ type: sel.value, options: [] });
    }
    function markDeleted(btn) { btn.closest('.eq-card').classList.add('deleted'); }
    function undoDelete(btn) { btn.closest('.eq-card').classList.remove('deleted'); }


      //  DRAG & DROP

    function initDrag() {
      const body = document.getElementById('editor-body');
      let dragged = null;
      body.querySelectorAll('.eq-card').forEach(card => {
        card.addEventListener('dragstart', e => { dragged = card; card.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
        card.addEventListener('dragend', () => { dragged = null; card.classList.remove('dragging'); body.querySelectorAll('.eq-card').forEach(c => c.classList.remove('drag-over')); renumber(); });
        card.addEventListener('dragover', e => { e.preventDefault(); if (card !== dragged) { body.querySelectorAll('.eq-card').forEach(c => c.classList.remove('drag-over')); card.classList.add('drag-over'); } });
        card.addEventListener('drop', e => {
          e.preventDefault();
          if (dragged && dragged !== card) {
            const all = [...body.querySelectorAll('.eq-card')];
            if (all.indexOf(dragged) < all.indexOf(card)) body.insertBefore(dragged, card.nextSibling);
            else body.insertBefore(dragged, card);
          }
        });
      });
    }
    function renumber() {
      let n = 1;
      document.querySelectorAll('#editor-body .eq-card:not(.deleted)').forEach(c => { c.querySelector('.eq-order').textContent = `Q${n++}`; });
    }


      //  SAVE EDITS

    function isQuestionUpdated(orig, current) {
      if (!orig) return true; // new question

      if (orig.questionText !== current.questionText) return true;
      if (orig.type !== current.type) return true;
      if (orig.required !== current.required) return true;

      // compare options
      const origOpts = orig.options || [];
      const currOpts = current.options || [];

      if (origOpts.length !== currOpts.length) return true;

      for (let i = 0; i < origOpts.length; i++) {
        if (
          origOpts[i].label !== currOpts[i].label ||
          origOpts[i].key !== currOpts[i].key
        ) {
          return true;
        }
      }

      return false;
    }

    async function saveEdits() {
      const newVersion = document.getElementById('new-version-checkbox').checked;
      const cards = [...document.querySelectorAll('#editor-body .eq-card')];

      const kept = [];
      const deleted = [];
      const updated = [];
      const created = [];

      cards.forEach((card, order) => {
        const isDel = card.classList.contains('deleted');

        const origIdx = card.dataset.idx !== undefined ? parseInt(card.dataset.idx) : null;
        const orig = origIdx !== null ? questions[origIdx] : null;

        const qText = card.dataset.qText || orig?.questionText || '';
        const qKey = orig?.questionKey || card.dataset.qKey || generateTempKey();
        const type = card.dataset.qType || orig?.type || 'TEXT';

        const required =
          card.dataset.qRequired !== undefined
            ? card.dataset.qRequired === 'true'
            : (orig?.required ?? false);

        const options = card.dataset.qOptions
          ? JSON.parse(card.dataset.qOptions)
          : orig?.options || [];

        const q = {
          id: orig?.id || null, // 🔥 important for backend
          order: order + 1,
          questionKey: qKey,
          questionText: qText,
          type,
          required,
          options
        };

        // 🔴 DELETE
        if (isDel) {
          if (q.id) deleted.push(q.id); // send only ID
          return;
        }

        kept.push(q);

        // 🟢 NEW
        if (!orig) {
          created.push(q);
          return;
        }

        // 🟡 UPDATED
        if (isQuestionUpdated(orig, q)) {
          updated.push(q);
        }
      });

      const payload = {
        surveyVersion: document.getElementById('survey-version').value,
        createNewVersion: newVersion,
        questions: kept,              // optional (full state)
        createdQuestions: created,    // 🔥 new
        updatedQuestions: updated,    // 🔥 changed
        deletedQuestionIds: deleted   // 🔥 only IDs
      };

      console.group('%c📋 Save All Edits', 'color:#D2C1B6;font-size:14px;font-weight:bold;');
      console.log('%cPayload', 'font-weight:bold;color:#9aafbe;', JSON.stringify(payload, null, 2));
      console.log('%cCreated', 'color:#4ade80;', created);
      console.log('%cUpdated', 'color:#facc15;', updated);
      console.log('%cDeleted IDs', 'color:#f87171;', deleted);
      console.groupEnd();


      if (deleted.length != 0 ){
      try {
        const res = await fetch(`/delete/question?createNewVersion=${payload.createNewVersion}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(deleted),
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);
              // update local state (simulate backend success)
        questions = kept.map(({ order, ...rest }) => rest);

        rebuildList();
        closeEditor();
        payload.createNewVersion && window.location.reload()

      }catch(error){

        console.error(error);
      }
    }
    if (updated.length != 0 ) {
      try {
        const res = await fetch(`/update/question?createNewVersion=${payload.createNewVersion}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);
              // update local state (simulate backend success)
        questions = kept.map(({ order, ...rest }) => rest);
        payload.createNewVersion && window.location.reload()
        rebuildList();
        closeEditor();

      }catch(error){

        console.error(error);
      }
    }
    }

    
      //  UTILS

    function showFeedback(type, msg) {
      const el = document.getElementById('submit-feedback');
      el.style.cssText = `display:flex;align-items:center;gap:8px;font-size:12px;padding:10px 14px;border-radius:8px;font-weight:500;margin-top:12px;`;
      if (type === 'success') { el.style.background = 'rgba(74,222,128,0.1)'; el.style.border = '1px solid rgba(74,222,128,0.3)'; el.style.color = '#4ade80'; el.innerHTML = `✓ ${msg}`; }
      else { el.style.background = 'rgba(248,113,113,0.1)'; el.style.border = '1px solid rgba(248,113,113,0.3)'; el.style.color = '#f87171'; el.innerHTML = `✕ ${msg}`; }
      clearTimeout(el._t); el._t = setTimeout(() => el.style.display = 'none', 4000);
    }
    function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    /* INIT */
    resetOptionRows();
    handleTypeChange();
    rebuildList();

    function changeVersion(selectElement) {
        const selectedVersion = selectElement.value;
        const surveyId = document.getElementById('survey-id').textContent;
        // Handle version change logic here
        window.location.href = `/questions/${surveyId}/${selectedVersion}`;
    }