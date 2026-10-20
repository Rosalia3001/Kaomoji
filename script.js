// script.js
// 从 kaomoji.js 读取数据并渲染：分类切换、搜索、三语切换、点击复制
(function () {
    'use strict';

    var DATA = window.KAOMOJI_DATA;
    if (!DATA) return;

    var CATS = DATA.categories;
    var ITEMS = DATA.items;
    var LANGS = ['zh', 'en', 'ja'];

    // ---------- 文案 ----------
    var TEXT = {
        copy: { zh: '点击复制', en: 'Click to copy', ja: 'クリックでコピー' },
        copied: { zh: '已复制!', en: 'Copied!', ja: 'コピーしました!' },
        fail: { zh: '复制失败', en: 'Copy failed', ja: 'コピー失敗' },
        all: { zh: '共 {n} 条', en: '{n} kaomoji', ja: '全 {n} 件' },
        found: { zh: '找到 {n} 条', en: '{n} found', ja: '{n} 件見つかりました' },
        none: { zh: '没有匹配的颜文字，换个关键词试试', en: 'No match. Try another keyword.', ja: '一致する顔文字がありません' }
    };

    function t(key, n) {
        var s = TEXT[key][state.lang];
        return n === undefined ? s : s.replace('{n}', n);
    }

    // ---------- 状态 ----------
    var state = {
        lang: 'zh',
        cat: CATS.length ? CATS[0].id : '',
        query: ''
    };

    var catById = {};
    var subByKey = {};
    CATS.forEach(function (c) {
        catById[c.id] = c;
        (c.subs || []).forEach(function (s) { subByKey[c.id + '|' + s.id] = s; });
    });

    // 预建搜索索引：颜文字文本 + 大类名 + 小节名（三语）
    var INDEX = ITEMS.map(function (it) {
        var c = catById[it.c];
        var s = subByKey[it.c + '|' + it.s];
        var parts = [it.t];
        if (c) parts.push(c.zh, c.en, c.ja);
        if (s) parts.push(s.zh, s.en, s.ja);
        return { it: it, hay: parts.join(' ').toLowerCase() };
    });

    var countByCat = {};
    ITEMS.forEach(function (it) { countByCat[it.c] = (countByCat[it.c] || 0) + 1; });

    // ---------- DOM ----------
    var el = {
        tabs: document.getElementById('category-tabs'),
        list: document.getElementById('kaomoji-list'),
        stats: document.getElementById('search-stats'),
        search: document.getElementById('search-input'),
        empty: document.getElementById('empty-hint'),
        notify: document.getElementById('copy-notification'),
        footerCount: document.getElementById('footer-count'),
        langBtns: Array.prototype.slice.call(document.querySelectorAll('.lang-btn'))
    };

    // ---------- 渲染 ----------
    function renderTabs() {
        el.tabs.textContent = '';
        CATS.forEach(function (c) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'tab-btn' + (c.id === state.cat && !state.query ? ' active' : '');
            btn.dataset.category = c.id;
            btn.appendChild(document.createTextNode(c[state.lang]));
            var num = document.createElement('span');
            num.className = 'tab-count';
            num.textContent = countByCat[c.id] || 0;
            btn.appendChild(num);
            el.tabs.appendChild(btn);
        });
    }

    function lenBucket(text) {
        var n = text.replace(/\s/g, '').length;
        if (n <= 10) return 's';
        if (n <= 18) return 'm';
        if (n <= 30) return 'l';
        return 'xl';
    }

    function makeItem(it) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'kaomoji-item';
        btn.dataset.len = lenBucket(it.t);
        if (it.t.indexOf('\n') > -1) btn.classList.add('is-multiline');
        btn.dataset.kaomoji = it.t;
        btn.textContent = it.t;
        btn.setAttribute('aria-label', it.t.replace(/\n/g, ' '));
        return btn;
    }

    function makeGrid(items) {
        var grid = document.createElement('div');
        grid.className = 'kaomoji-grid';
        var frag = document.createDocumentFragment();
        items.forEach(function (it) { frag.appendChild(makeItem(it)); });
        grid.appendChild(frag);
        return grid;
    }

    function renderList() {
        el.list.textContent = '';
        var shown = 0;

        if (state.query) {
            // 全局搜索：扁平结果，按大类/小节原顺序排列
            var q = state.query.toLowerCase();
            var hits = [];
            for (var i = 0; i < INDEX.length; i++) {
                if (INDEX[i].hay.indexOf(q) > -1) hits.push(INDEX[i].it);
            }
            if (hits.length) {
                el.list.appendChild(makeGrid(hits));
            }
            shown = hits.length;
        } else {
            // 按当前大类渲染，按小节分组
            var cat = catById[state.cat];
            (cat.subs || []).forEach(function (sub) {
                var group = ITEMS.filter(function (it) {
                    return it.c === state.cat && it.s === sub.id;
                });
                if (!group.length) return;
                var h3 = document.createElement('h3');
                h3.textContent = sub[state.lang];
                h3.appendChild(makeCountBadge(group.length));
                el.list.appendChild(h3);
                el.list.appendChild(makeGrid(group));
                shown += group.length;
            });
        }

        el.empty.hidden = shown > 0;
        el.empty.textContent = t('none');
        el.stats.textContent = state.query ? t('found', shown) : t('all', ITEMS.length);
    }

    function makeCountBadge(n) {
        var span = document.createElement('span');
        span.className = 'sub-count';
        span.textContent = n;
        return span;
    }

    // ---------- 静态文案（含 placeholder） ----------
    function applyStatic() {
        document.querySelectorAll('[data-zh]').forEach(function (node) {
            var v = node.getAttribute('data-' + state.lang) || node.getAttribute('data-zh');
            if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
                node.placeholder = v;
            } else {
                node.textContent = v;
            }
        });
        el.langBtns.forEach(function (b) {
            b.classList.toggle('active', b.dataset.lang === state.lang);
        });
        if (el.footerCount) el.footerCount.textContent = ITEMS.length + ' kaomoji';
        el.notify.textContent = t('copied');
    }

    function renderAll() {
        applyStatic();
        renderTabs();
        renderList();
    }

    // ---------- 复制 ----------
    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise(function (resolve, reject) {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            try {
                document.execCommand('copy') ? resolve() : reject(new Error('copy failed'));
            } catch (err) {
                reject(err);
            } finally {
                document.body.removeChild(ta);
            }
        });
    }

    var notifyTimer = null;
    function notify(msg) {
        el.notify.textContent = msg;
        el.notify.classList.add('show');
        clearTimeout(notifyTimer);
        notifyTimer = setTimeout(function () {
            el.notify.classList.remove('show');
            el.notify.textContent = t('copied');
        }, 1600);
    }

    // ---------- 事件 ----------
    el.list.addEventListener('click', function (e) {
        var btn = e.target.closest('.kaomoji-item');
        if (!btn) return;
        copyText(btn.dataset.kaomoji).then(function () {
            notify(t('copied'));
            btn.classList.add('is-copied');
            setTimeout(function () { btn.classList.remove('is-copied'); }, 600);
        }).catch(function () {
            notify(t('fail'));
        });
    });

    el.tabs.addEventListener('click', function (e) {
        var btn = e.target.closest('.tab-btn');
        if (!btn) return;
        state.cat = btn.dataset.category;
        state.query = '';
        el.search.value = '';
        localStorage.setItem('kaomoji-cat', state.cat);
        renderTabs();
        renderList();
    });

    var searchTimer = null;
    el.search.addEventListener('input', function () {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () {
            state.query = el.search.value.trim();
            renderTabs();
            renderList();
        }, 80);
    });

    el.langBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            state.lang = btn.dataset.lang;
            localStorage.setItem('preferred-language', state.lang);
            renderAll();
        });
    });

    document.addEventListener('keydown', function (e) {
        var typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);

        if (e.key === 'Escape') {
            if (state.query) {
                el.search.value = '';
                state.query = '';
                renderTabs();
                renderList();
            } else {
                el.notify.classList.remove('show');
            }
            if (typing) el.search.blur();
            return;
        }

        if (e.key === '/' && !typing) {
            e.preventDefault();
            el.search.focus();
            return;
        }

        if (!typing && e.key >= '1' && e.key <= '9') {
            var idx = parseInt(e.key, 10) - 1;
            if (CATS[idx]) {
                state.cat = CATS[idx].id;
                state.query = '';
                el.search.value = '';
                localStorage.setItem('kaomoji-cat', state.cat);
                renderTabs();
                renderList();
            }
        }
    });

    // ---------- 初始化 ----------
    (function init() {
        var saved = localStorage.getItem('preferred-language');
        if (saved && LANGS.indexOf(saved) > -1) {
            state.lang = saved;
        } else {
            var nav = (navigator.language || 'zh').toLowerCase();
            state.lang = nav.indexOf('zh') === 0 ? 'zh' : (nav.indexOf('ja') === 0 ? 'ja' : 'en');
        }

        var savedCat = localStorage.getItem('kaomoji-cat');
        if (savedCat && catById[savedCat]) state.cat = savedCat;

        // 支持深度链接：#ascii 直接打开对应分类
        var hash = (location.hash || '').replace('#', '');
        if (hash && catById[hash]) state.cat = hash;

        renderAll();
        console.log('颜文字收藏馆已加载：' + ITEMS.length + ' 条 (◕‿◕✿)');
    })();
})();
