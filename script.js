const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const runBtn = document.getElementById('runBtn');
const exportBtn = document.getElementById('exportBtn');
const resetBtn = document.getElementById('resetBtn');
const autoRun = document.getElementById('autoRun');
const split = document.getElementById('split');

// Editor is blank by default
editor.value = '';

function debounce(fn, ms) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

function updatePreview() {
    preview.srcdoc = editor.value;
}

const debouncedUpdate = debounce(() => { if (autoRun.checked) updatePreview(); }, 400);

editor.addEventListener('input', debouncedUpdate);

runBtn.addEventListener('click', () => { updatePreview(); flash(runBtn); });

function exportHTML() {
    const filename = prompt('Filename (without extension):', 'page') || 'page';
    const blob = new Blob([editor.value], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename + '.html';
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

exportBtn.addEventListener('click', exportHTML);

resetBtn.addEventListener('click', () => {
    if (confirm('Reset editor? This will clear all content.')) { editor.value = ''; updatePreview(); }
});

window.addEventListener('keydown', (e) => {
    const c = e.ctrlKey || e.metaKey;
    if (c && e.key === 'Enter') { e.preventDefault(); updatePreview(); flash(runBtn); }
    if (c && (e.key === 's' || e.key === 'S')) { e.preventDefault(); exportHTML(); }
});

function flash(el) { el.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.96)' }, { transform: 'scale(1)' }], { duration: 180 }); }

updatePreview();

split.style.cursor = 'default';

let initial = editor.value;
window.addEventListener('beforeunload', e => { if (editor.value !== initial) { e.preventDefault(); e.returnValue = 'Unsaved changes'; } });
