/* comments.js: replies, emoji reactions and an anonymous / named toggle.
   Loaded after the main script in writing.html, so it replaces buildReactionsHTML,
   loadReactions and toggleLike. */
(function () {
  'use strict';

  const EMOJIS = ['❤️', '😂', '😢', '🔥', '🙏', '💯'];
  const BLOCKED_NAME = /sharon|mutanu|author|admin|moderator/i;
  const MODE_KEY = 'sm-comment-mode';
  const NAME_KEY = 'sm-comment-name';
  const HEART_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;"><defs><linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff6b9d;stop-opacity:1" /><stop offset="100%" style="stop-color:#e05c7a;stop-opacity:1" /></linearGradient></defs><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="url(#heartGrad)"/></svg>`;
  const state = {};
  let isAuthor = false;

  const lsGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const getMode = () => (lsGet(MODE_KEY) === 'name' ? 'name' : 'anon');
  const getName = () => (lsGet(NAME_KEY) || '').trim();

  function identity() {
    if (isAuthor) return { label: 'Sharon', author: true };
    if (getMode() === 'name') {
      const name = getName();
      if (name.length < 2 || name.length > 24 || BLOCKED_NAME.test(name)) return null;
      return { label: name };
    }
    return { label: 'Reader #' + getAnonId().slice(0, 4) };
  }

  function initialOf(c) {
    if (c.is_author === true) return 'S';
    const l = c.anon_label || 'R';
    const i = l.indexOf('#');
    return (i >= 0 ? l.charAt(i + 1) : l.charAt(0)).toUpperCase();
  }

  function reactionBar(slug, id, rx, replyTo, c) {
    const s = escHtml(slug);
    const me = getAnonId();
    const mine = new Set();
    const counts = {};
    rx.forEach((x) => {
      if (x.comment_id !== id) return;
      counts[x.emoji] = (counts[x.emoji] || 0) + 1;
      if (x.anon_id === me) mine.add(x.emoji);
    });
    const pills = EMOJIS.filter((e) => counts[e]).map((e) =>
      `<button type="button" class="cm-pill${mine.has(e) ? ' mine' : ''}" data-act="react" data-slug="${s}" data-id="${id}" data-emoji="${e}">${e} <span>${counts[e]}</span></button>`
    ).join('');
    const picker = EMOJIS.map((e) =>
      `<button type="button" class="cm-emo" data-act="react" data-slug="${s}" data-id="${id}" data-emoji="${e}">${e}</button>`
    ).join('');
    const replyBtn = `<button type="button" class="cm-reply-btn" data-act="reply" data-slug="${s}" data-id="${replyTo}">Reply</button>`;
    const liked = c.author_liked === true;
    const authorLike = liked ? '<span class="cm-authorlike">♥ Sharon liked this</span>' : '';
    const authorTools = isAuthor
      ? `<button type="button" class="cm-reply-btn" data-act="alike" data-slug="${s}" data-id="${id}">${liked ? 'Unlike' : 'Like as author'}</button>` +
        `<button type="button" class="cm-reply-btn cm-del" data-act="del" data-slug="${s}" data-id="${id}">Delete</button>`
      : '';
    return `<div class="cm-actions">${pills}<button type="button" class="cm-add" data-act="picker" aria-label="Add reaction">☺</button><span class="cm-picker">${picker}</span>${replyBtn}${authorLike}${authorTools}</div>`;
  }

  function commentHTML(c, ctx, isReply, parentId) {
    const { slug, rx, byParent } = ctx;
    const s = escHtml(slug);
    const id = String(c.id);
    const isAuthor = c.is_author === true;
    const label = isAuthor ? 'Sharon' : escHtml(c.anon_label || 'Anonymous');
    const badge = isAuthor ? '<span class="comment-author-badge">Author</span>' : '';
    const avatarClass = isAuthor ? 'comment-avatar author-avatar' : 'comment-avatar';

    const legacy = c.reply_body ? `
      <div class="comment-reply">
        <div class="comment-reply-meta">
          <span class="comment-reply-label">✦ Sharon replied</span>
          <span class="comment-time">${c.reply_at ? relativeTime(c.reply_at) : ''}</span>
        </div>
        <div class="comment-reply-body">${escHtml(c.reply_body)}</div>
      </div>` : '';

    const kids = isReply ? '' : (byParent[id] || []).map((k) => commentHTML(k, ctx, true, id)).join('');
    const replyForm = isReply ? '' : `
      <div class="cm-replyform" id="cm-reply-${id}" hidden>
        <textarea class="comment-textarea" id="cm-reply-input-${id}" maxlength="500" placeholder="Write a reply…"></textarea>
        <div class="cm-replyfoot">
          <span class="cm-as"></span>
          <button type="button" class="comment-submit" data-act="send-reply" data-slug="${s}" data-id="${id}">Reply</button>
        </div>
      </div>`;

    return `
      <div class="comment-item${isAuthor ? ' author-comment' : ''}${isReply ? ' cm-reply' : ''}" id="cm-${id}">
        <div class="comment-meta">
          <div class="${avatarClass}">${escHtml(initialOf(c))}</div>
          <span class="comment-anon">${label}</span>${badge}
          <span class="comment-time">${relativeTime(c.created_at)}</span>
        </div>
        <div class="comment-body">${escHtml(c.body)}</div>
        ${legacy}
        ${reactionBar(slug, id, rx, isReply ? parentId : id, c)}
        ${replyForm}
        ${kids ? `<div class="cm-replies">${kids}</div>` : ''}
      </div>`;
  }

  function render(slug) {
    const list = document.getElementById(`comment-list-${slug}`);
    const st = state[slug];
    if (!list || !st) return;
    const top = [];
    const byParent = {};
    st.comments.forEach((c) => {
      if (c.parent_id) {
        const p = String(c.parent_id);
        (byParent[p] = byParent[p] || []).push(c);
      } else {
        top.push(c);
      }
    });
    if (!top.length) {
      list.innerHTML = '<p class="comments-empty">Be the first to leave a thought.</p>';
      return;
    }
    const ctx = { slug, rx: st.rx, byParent };
    list.innerHTML = top.map((c) => commentHTML(c, ctx, false)).join('');
  }

  window.buildReactionsHTML = function (slug) {
    const s = escHtml(slug);
    const named = getMode() === 'name';
    return `
      <div class="r-reactions" id="reactions-${slug}">
        <div class="r-reactions-header">
          <span class="r-reactions-label">Reactions</span>
          <button class="like-btn" id="like-btn-${slug}" data-act="like" data-slug="${s}">
            <span class="like-heart">${HEART_SVG}</span>
            <span class="like-count" id="like-count-${slug}">—</span>
          </button>
        </div>
        <div class="comment-form">
          <div class="cid">
            <button type="button" class="cid-btn${named ? '' : ' active'}" data-act="mode" data-mode="anon" data-slug="${s}">Anonymous</button>
            <button type="button" class="cid-btn${named ? ' active' : ''}" data-act="mode" data-mode="name" data-slug="${s}">Use a name</button>
            <input class="cid-name" id="comment-name-${slug}" maxlength="24" placeholder="Your name" value="${escHtml(getName())}"${named ? '' : ' hidden'}>
          </div>
          <textarea class="comment-textarea" id="comment-input-${slug}"
            placeholder="Leave a thought…" maxlength="500"
            oninput="document.getElementById('comment-chars-${slug}').textContent = this.value.length + ' / 500'"></textarea>
          <div class="comment-form-footer">
            <span class="comment-char" id="comment-chars-${slug}">0 / 500</span>
            <button class="comment-submit" data-act="send" data-slug="${s}">${named ? 'Post' : 'Post anonymously'}</button>
          </div>
        </div>
        <div class="comment-list" id="comment-list-${slug}">
          <p class="comments-loading">Loading comments…</p>
        </div>
        <div class="cm-auth" id="cm-auth-${slug}"></div>
      </div>`;
  };

  async function load(slug) {
    const btn = document.getElementById(`like-btn-${slug}`);
    const countEl = document.getElementById(`like-count-${slug}`);
    const list = document.getElementById(`comment-list-${slug}`);
    if (!btn || !list) return;
    const me = getAnonId();

    const { count } = await sb.from('likes').select('*', { count: 'exact', head: true }).eq('piece_slug', slug);
    countEl.textContent = count ?? 0;
    const { data: myLike } = await sb.from('likes').select('id').eq('piece_slug', slug).eq('anon_id', me).maybeSingle();
    if (myLike) btn.classList.add('liked');

    const { data: comments, error } = await sb.from('comments').select('*').eq('piece_slug', slug).order('created_at', { ascending: true });
    if (error) {
      list.innerHTML = '<p class="comments-empty">Could not load comments.</p>';
      return;
    }
    let rx = [];
    const ids = (comments || []).map((c) => String(c.id));
    if (ids.length) {
      const r = await sb.from('comment_reactions').select('comment_id, emoji, anon_id').in('comment_id', ids);
      if (!r.error) rx = r.data || [];
    }
    state[slug] = { comments: comments || [], rx };
    await checkSession();
    renderAuth(slug);
    render(slug);
  }
  window.loadReactions = load;

  async function toggleLike(slug) {
    const btn = document.getElementById(`like-btn-${slug}`);
    const countEl = document.getElementById(`like-count-${slug}`);
    if (!btn || !countEl) return;
    const me = getAnonId();
    const { data: existing } = await sb.from('likes').select('id').eq('piece_slug', slug).eq('anon_id', me).maybeSingle();
    const n = parseInt(countEl.textContent, 10) || 0;
    if (existing) {
      await sb.from('likes').delete().eq('id', existing.id);
      btn.classList.remove('liked');
      countEl.textContent = Math.max(0, n - 1);
    } else {
      await sb.from('likes').insert({ piece_slug: slug, anon_id: me });
      btn.classList.add('liked');
      countEl.textContent = n + 1;
    }
  }
  window.toggleLike = toggleLike;

  async function checkSession() {
    try {
      const { data } = await sb.auth.getSession();
      isAuthor = !!(data && data.session);
    } catch (e) { isAuthor = false; }
  }

  function renderAuth(slug) {
    const box = document.getElementById(`cm-auth-${slug}`);
    const wrap = document.getElementById(`reactions-${slug}`);
    if (!box) return;
    const s = escHtml(slug);
    if (isAuthor) {
      box.innerHTML = `<span class="cm-authnote">Signed in as author</span> <button type="button" class="cm-link" data-act="signout" data-slug="${s}">Sign out</button>`;
    } else {
      box.innerHTML = `<button type="button" class="cm-link" data-act="authform" data-slug="${s}">Author sign in</button>
        <form class="cm-authform" id="cm-authform-${s}" data-act-form="signin" data-slug="${s}" hidden>
          <input type="email" id="cm-auth-email-${s}" placeholder="Email" autocomplete="username">
          <input type="password" id="cm-auth-pass-${s}" placeholder="Password" autocomplete="current-password">
          <button type="submit" class="comment-submit">Sign in</button>
        </form>`;
    }
    if (wrap) {
      const cid = wrap.querySelector('.cid');
      if (cid) cid.hidden = isAuthor;
      const sendBtn = wrap.querySelector('.comment-submit[data-act="send"]');
      if (sendBtn) sendBtn.textContent = isAuthor ? 'Post as Sharon' : (getMode() === 'name' ? 'Post' : 'Post anonymously');
    }
  }

  async function signIn(slug) {
    const email = document.getElementById(`cm-auth-email-${slug}`).value.trim();
    const pass = document.getElementById(`cm-auth-pass-${slug}`).value;
    if (!email || !pass) return;
    const { error } = await sb.auth.signInWithPassword({ email, password: pass });
    if (error) { toast('Sign in failed'); return; }
    isAuthor = true;
    toast('Welcome back, Sharon ✦');
    Object.keys(state).forEach((k) => { renderAuth(k); render(k); });
  }

  async function signOut() {
    await sb.auth.signOut();
    isAuthor = false;
    toast('Signed out');
    Object.keys(state).forEach((k) => { renderAuth(k); render(k); });
  }

  async function authorLike(slug, id) {
    const st = state[slug];
    const c = st && st.comments.find((x) => String(x.id) === String(id));
    if (!c) return;
    const next = !(c.author_liked === true);
    const { data, error } = await sb.from('comments').update({ author_liked: next }).eq('id', c.id).select();
    if (error || !data || !data.length) { toast('Could not update (are you signed in?)'); return; }
    c.author_liked = next;
    render(slug);
  }

  async function removeComment(slug, id) {
    const st = state[slug];
    if (!st) return;
    if (!window.confirm('Delete this comment and any replies to it?')) return;
    const ids = [String(id)].concat(st.comments.filter((c) => String(c.parent_id) === String(id)).map((c) => String(c.id)));
    const del = await sb.from('comments').delete().eq('id', id);
    if (del.error) { toast('Could not delete'); return; }
    await sb.from('comments').delete().eq('parent_id', String(id));
    await sb.from('comment_reactions').delete().in('comment_id', ids);
    st.comments = st.comments.filter((c) => !ids.includes(String(c.id)));
    st.rx = st.rx.filter((x) => !ids.includes(x.comment_id));
    render(slug);
    toast('Deleted');
  }

  async function post(slug, body, parentId, btn) {
    const idn = identity();
    if (!idn) { toast('Choose another name (2 to 24 characters)'); return false; }
    btn.disabled = true;
    const row = {
      piece_slug: slug,
      body,
      anon_id: getAnonId(),
      anon_label: idn.label,
      parent_id: parentId ? String(parentId) : null,
    };
    if (idn.author) row.is_author = true;
    const { data, error } = await sb.from('comments').insert(row).select().single();
    btn.disabled = false;
    if (error) { toast('Could not post, try again'); return false; }
    const st = state[slug] || (state[slug] = { comments: [], rx: [] });
    st.comments.push(data);
    render(slug);
    toast('Posted ✦');
    return true;
  }

  async function react(slug, commentId, emoji) {
    const st = state[slug];
    if (!st) return;
    const me = getAnonId();
    const idx = st.rx.findIndex((x) => x.comment_id === commentId && x.anon_id === me && x.emoji === emoji);
    if (idx >= 0) {
      st.rx.splice(idx, 1);
      render(slug);
      const { error } = await sb.from('comment_reactions').delete()
        .eq('comment_id', commentId).eq('anon_id', me).eq('emoji', emoji);
      if (error) { toast('Could not update reaction'); load(slug); }
    } else {
      st.rx.push({ comment_id: commentId, anon_id: me, emoji });
      render(slug);
      const { error } = await sb.from('comment_reactions').insert({ comment_id: commentId, anon_id: me, emoji });
      if (error) { toast('Could not react, try again'); load(slug); }
    }
  }

  function setMode(slug, mode) {
    lsSet(MODE_KEY, mode);
    const wrap = document.getElementById(`reactions-${slug}`);
    if (!wrap) return;
    wrap.querySelectorAll('.cid-btn').forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));
    const input = wrap.querySelector('.cid-name');
    input.hidden = mode !== 'name';
    if (mode === 'name') input.focus();
    wrap.querySelector('.comment-submit[data-act="send"]').textContent = isAuthor ? 'Post as Sharon' : (mode === 'name' ? 'Post' : 'Post anonymously');
  }

  document.addEventListener('input', (e) => {
    if (e.target.classList && e.target.classList.contains('cid-name')) lsSet(NAME_KEY, e.target.value);
  });

  document.addEventListener('submit', (e) => {
    const f = e.target;
    if (f && f.dataset && f.dataset.actForm === 'signin') {
      e.preventDefault();
      signIn(f.dataset.slug);
    }
  });

  document.addEventListener('click', async (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;
    const slug = el.dataset.slug;
    const id = el.dataset.id;

    if (act === 'like') { toggleLike(slug); return; }
    if (act === 'mode') { setMode(slug, el.dataset.mode); return; }
    if (act === 'react') { react(slug, id, el.dataset.emoji); return; }
    if (act === 'authform') {
      const f = document.getElementById(`cm-authform-${slug}`);
      if (f) { f.hidden = !f.hidden; if (!f.hidden) f.querySelector('input').focus(); }
      return;
    }
    if (act === 'signout') { signOut(); return; }
    if (act === 'alike') { authorLike(slug, id); return; }
    if (act === 'del') { removeComment(slug, id); return; }
    if (act === 'picker') {
      el.parentElement.querySelector('.cm-picker').classList.toggle('open');
      return;
    }
    if (act === 'reply') {
      const form = document.getElementById(`cm-reply-${id}`);
      if (!form) return;
      form.hidden = !form.hidden;
      if (!form.hidden) {
        const idn = identity();
        form.querySelector('.cm-as').textContent = idn ? `Replying as ${idn.label}${idn.author ? ' (Author)' : ''}` : 'Add a name above to reply by name';
        form.querySelector('textarea').focus();
      }
      return;
    }
    if (act === 'send') {
      const input = document.getElementById(`comment-input-${slug}`);
      const body = input.value.trim();
      if (!body) return;
      const ok = await post(slug, body, null, el);
      if (ok) {
        input.value = '';
        document.getElementById(`comment-chars-${slug}`).textContent = '0 / 500';
      }
      return;
    }
    if (act === 'send-reply') {
      const input = document.getElementById(`cm-reply-input-${id}`);
      const body = input ? input.value.trim() : '';
      if (!body) return;
      await post(slug, body, id, el);
    }
  });

  const style = document.createElement('style');
  style.textContent = `
    .cid{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin-bottom:.6rem}
    .cid-btn{font:inherit;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;padding:.35rem .8rem;border:1px solid var(--line,rgba(255,255,255,.12));background:transparent;color:var(--muted,#8a8a8a);cursor:pointer;border-radius:1px}
    .cid-btn.active{color:var(--gold,#d4af37);border-color:var(--gold-dim,rgba(212,175,55,.4))}
    .cid-name{font:inherit;font-size:.85rem;padding:.4rem .6rem;background:transparent;color:inherit;border:1px solid var(--line,rgba(255,255,255,.12));border-radius:1px;min-width:10rem}
    .cid-name[hidden],.cm-replyform[hidden]{display:none}
    .cm-actions{display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;margin-top:.6rem}
    .cm-pill,.cm-add,.cm-reply-btn{font:inherit;font-size:.8rem;border:1px solid var(--line,rgba(255,255,255,.12));background:transparent;color:var(--muted,#8a8a8a);padding:.2rem .55rem;border-radius:999px;cursor:pointer}
    .cm-pill.mine{border-color:var(--gold,#d4af37);color:var(--gold,#d4af37)}
    .cm-reply-btn{border-radius:1px;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase}
    .cm-picker{display:none;gap:.25rem}
    .cm-picker.open{display:inline-flex;flex-wrap:wrap}
    .cm-emo{font:inherit;font-size:1rem;border:0;background:transparent;padding:.1rem .3rem;cursor:pointer}
    .cm-replyform{margin-top:.7rem}
    .cm-replyfoot{display:flex;justify-content:space-between;align-items:center;gap:.6rem;margin-top:.4rem}
    .cm-as{font-size:.7rem;color:var(--muted,#8a8a8a)}
    .cm-replies{margin-top:.8rem;margin-left:1.1rem;padding-left:1rem;border-left:1px solid var(--line,rgba(255,255,255,.12))}
    .cm-reply{margin-top:.6rem}
    .cm-auth{margin-top:2rem;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#8a8a8a)}
    .cm-link{font:inherit;background:none;border:0;color:inherit;opacity:.6;cursor:pointer;text-decoration:underline;padding:0}
    .cm-authform{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.7rem}
    .cm-authform[hidden]{display:none}
    .cm-authform input{font:inherit;font-size:.85rem;padding:.4rem .6rem;background:transparent;color:inherit;border:1px solid var(--line,rgba(255,255,255,.12));border-radius:1px}
    .cm-authorlike{font-size:.75rem;color:#e05c7a}
    .cm-del{color:#e05c7a}
    .like-btn .like-heart svg{opacity:.55;transition:opacity .2s,transform .2s}
    .like-btn.liked .like-heart svg{opacity:1;transform:scale(1.1)}
  `;
  document.head.appendChild(style);
})();