(() => {
  const { loadDB, saveDB, getSession, clearSession, escapeHTML } = window.MorattoDB;
  const session = getSession();
  const portal = document.body.dataset.portal;
  const expectedRole = portal === 'admin' ? 'admin' : 'student';

  if (!session || session.role !== expectedRole) {
    clearSession();
    window.location.replace(`login.html?role=${expectedRole}`);
    return;
  }

  const content = document.getElementById('content');
  const title = document.getElementById('title');
  const who = document.getElementById('who');
  who.textContent = session.name || (expectedRole === 'admin' ? 'Personal' : 'Aluno');

  const setTitle = (value) => { title.textContent = value; };
  const empty = (text) => `<div class="card empty-state"><p class="muted">${escapeHTML(text)}</p></div>`;

  function renderStudent(view) {
    const db = loadDB();
    const student = db.students.find((item) => item.id === session.studentId);
    const workout = db.workouts.find((item) => item.studentId === session.studentId);
    if (!student) { content.innerHTML = empty('Perfil de aluno não encontrado.'); return; }
    if (view === 'home') {
      setTitle('MINHA ÁREA');
      content.innerHTML = `<div class="grid"><div class="card"><div class="metric">${escapeHTML(student.weight || '-')}</div><div class="muted">Peso (kg)</div></div><div class="card"><div class="metric">${workout?.items?.length || 0}</div><div class="muted">Exercícios no treino</div></div></div><div class="card" style="margin-top:14px"><h3>Objetivo</h3><p class="muted">${escapeHTML(student.goal || 'Defina seu objetivo com o Personal.')}</p></div>`;
    } else if (view === 'workout') {
      setTitle('MEU TREINO');
      if (!workout) { content.innerHTML = empty('Seu treino aparecerá aqui.'); return; }
      const rows = workout.items.map((item, index) => `<tr><td>${escapeHTML(item.name)}</td><td>${item.sets}</td><td>${escapeHTML(item.reps)}</td><td><button class="btn ${item.done ? 'primary' : ''}" data-done="${index}">${item.done ? 'Concluído' : 'Marcar'}</button></td></tr>`).join('');
      content.innerHTML = `<div class="card"><h3>${escapeHTML(workout.name)}</h3><div class="table-wrap"><table class="table"><thead><tr><th>Exercício</th><th>Séries</th><th>Reps</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
      content.querySelectorAll('[data-done]').forEach((button) => button.addEventListener('click', () => {
        const current = loadDB(); const currentWorkout = current.workouts.find((item) => item.studentId === session.studentId); const item = currentWorkout?.items?.[Number(button.dataset.done)];
        if (item) { item.done = !item.done; saveDB(current); renderStudent('workout'); }
      }));
    } else { setTitle('EVOLUÇÃO'); content.innerHTML = empty('Registre peso e avaliações para acompanhar sua evolução.'); }
  }

  function renderAdmin(view) {
    const db = loadDB(); setTitle(view.toUpperCase());
    if (view === 'dashboard') content.innerHTML = `<div class="grid"><div class="card"><div class="metric">${db.students.length}</div><div class="muted">Alunos</div></div><div class="card"><div class="metric">${db.workouts.length}</div><div class="muted">Treinos</div></div><div class="card"><div class="metric">${db.events.length}</div><div class="muted">Eventos</div></div><div class="card"><div class="metric">${db.payments.length}</div><div class="muted">Pagamentos</div></div></div><div class="card" style="margin-top:14px"><p class="muted">Área privada funcionando. Use o menu para gerenciar alunos, treinos e agenda.</p></div>`;
    else if (view === 'students') content.innerHTML = `<div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Nome</th><th>Objetivo</th><th>Peso</th><th>Login</th></tr></thead><tbody>${db.students.map((student) => { const account = db.accounts.find((item) => item.studentId === student.id); return `<tr><td>${escapeHTML(student.name)}</td><td>${escapeHTML(student.goal || '-')}</td><td>${escapeHTML(student.weight || '-')} kg</td><td>${escapeHTML(account?.login || '-')}</td></tr>`; }).join('')}</tbody></table></div></div>`;
    else if (view === 'workouts') content.innerHTML = `<div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Treino</th><th>Aluno</th><th>Exercícios</th></tr></thead><tbody>${db.workouts.map((workout) => `<tr><td>${escapeHTML(workout.name)}</td><td>${escapeHTML(db.students.find((student) => student.id === workout.studentId)?.name || '-')}</td><td>${workout.items?.length || 0}</td></tr>`).join('')}</tbody></table></div></div>`;
    else if (view === 'agenda') content.innerHTML = empty('Nenhum evento cadastrado ainda.');
    else if (view === 'finance') content.innerHTML = empty('Nenhum pagamento cadastrado ainda.');
    else content.innerHTML = empty('Registre avaliações na base local para acompanhar a evolução.');
  }

  window.show = (view) => expectedRole === 'admin' ? renderAdmin(view) : renderStudent(view);
  window.logout = () => { clearSession(); window.location.href = `login.html?role=${expectedRole}`; };
  window.show(portal === 'admin' ? 'dashboard' : 'home');
})();
