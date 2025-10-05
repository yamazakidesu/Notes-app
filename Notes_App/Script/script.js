// DATA DUMMY
const notesData = [
  {
    id: 'notes-1',
    title: 'Babel',
    body: 'Babel merupakan tools open-source ...',
    createdAt: '2025-10-5',
    archived: false,
  },
  {
    id: 'notes-2',
    title: 'Functional Component',
    body: 'Functional component merupakan React component ...',
    createdAt: '20225-10-5',
    archived: false,
  },
  {
    id: 'notes-3',
    title: 'Modularization',
    body: 'Dalam konteks pemrograman JavaScript, modularization ...',
    createdAt: '2025-10-5',
    archived: false,
  },
];

// === APP BAR ===
class AppBar extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || 'Notes App';
    const subtitle = this.getAttribute('subtitle') || 'Simple & Clean Note Workspace';

    this.innerHTML = `
      <style>
        .app-bar {
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 1.5rem 2rem;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          text-align: center;
          margin-bottom: 2rem;
        }
        .app-bar h1 {
          font-size: 1.75rem;
          font-weight: 600;
          color: #1f1f1f;
          margin-bottom: 0.25rem;
        }
        .app-bar p {
          font-size: 0.95rem;
          color: #666;
        }
        @media (max-width: 640px) {
          .app-bar { padding: 1rem; }
          .app-bar h1 { font-size: 1.4rem; }
        }
      </style>
      <div class="app-bar">
        <h1>${title}</h1>
        <p>${subtitle}</p>
      </div>
    `;
  }
}

// === NOTE FORM ===
class NoteForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .note-form {
          background: #ffffff;
          border: 1px solid #aaa;
          border-radius: 12px;
          padding: 1.5rem 2rem;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          margin-bottom: 2rem;
        }
        .form-group {
          margin-bottom: 1.25rem;
        }
        label {
          font-weight: 500;
          font-size: 0.95rem;
          color: #222;
          display: block;
          margin-bottom: 0.5rem;
        }
        input, textarea {
          width: 100%;
          padding: 0.75rem;
          font-size: 0.95rem;
          font-family: inherit;
          border: 1px solid #777;
          border-radius: 8px;
          background-color: #fafafa;
          transition: border 0.2s ease, background 0.2s ease;
        }
        input:focus, textarea:focus {
          outline: none;
          border-color: #aaa;
          background-color: #fff;
        }
        textarea {
          resize: vertical;
          min-height: 100px;
        }
        .char-count {
          font-size: 0.8rem;
          color: #999;
          text-align: right;
          margin-top: 4px;
        }
        button {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid #ccc;
          background: #f8f8f8;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        button:hover {
          background: #efefef;
          box-shadow: 0 4px 10px rgba(0,0,0,0.50);
        }
        button:disabled {
          opacity: 1;
          cursor: not-allowed;
        }
      </style>

      <form class="note-form" id="noteForm">
        <div class="form-group">
          <label for="noteTitle">Judul Catatan</label>
          <input type="text" id="noteTitle" placeholder="Masukkan judul catatan..." required maxlength="50">
          <div class="char-count" id="titleCount">0/50 karakter</div>
        </div>
        <div class="form-group">
          <label for="noteBody">Isi Catatan</label>
          <textarea id="noteBody" placeholder="Tuliskan isi catatan Anda..." required></textarea>
          <div class="char-count" id="bodyCount">0 karakter</div>
        </div>
        <button type="submit" id="submitBtn" disabled>Tambah Catatan</button>
      </form>
    `;
    this.setupValidation();
  }

  setupValidation() {
    const form = this.querySelector('#noteForm');
    const titleInput = this.querySelector('#noteTitle');
    const bodyInput = this.querySelector('#noteBody');
    const titleCount = this.querySelector('#titleCount');
    const bodyCount = this.querySelector('#bodyCount');
    const submitBtn = this.querySelector('#submitBtn');

    titleInput.addEventListener('input', () => {
      titleCount.textContent = `${titleInput.value.length}/50 karakter`;
      this.validateForm();
    });
    bodyInput.addEventListener('input', () => {
      bodyCount.textContent = `${bodyInput.value.length} karakter`;
      this.validateForm();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newNote = {
        id: `notes-${Date.now()}`,
        title: titleInput.value,
        body: bodyInput.value,
        createdAt: new Date().toISOString(),
        archived: false,
      };
      this.dispatchEvent(new CustomEvent('note-added', {
        detail: newNote,
        bubbles: true,
        composed: true,
      }));
      form.reset();
      titleCount.textContent = '0/50 karakter';
      bodyCount.textContent = '0 karakter';
      submitBtn.disabled = true;
    });
  }

  validateForm() {
    const title = this.querySelector('#noteTitle').value.trim();
    const body = this.querySelector('#noteBody').value.trim();
    const submitBtn = this.querySelector('#submitBtn');
    submitBtn.disabled = !(title.length >= 3 && body.length >= 10);
  }
}

// === NOTE ITEM ===
class NoteItem extends HTMLElement {
  static get observedAttributes() {
    return ['note-id', 'note-title', 'note-body', 'note-date'];
  }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const id = this.getAttribute('note-id');
    const title = this.getAttribute('note-title');
    const body = this.getAttribute('note-body');
    const date = new Date(this.getAttribute('note-date')).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    this.innerHTML = `
      <style>
        .note-card {
          background: #fff;
          border: 1px solid #aaa;
          border-radius: 10px;
          padding: 1rem 1.25rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .note-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.50);
        }
        .note-title {
          font-weight: 600;
          color: #222;
          margin-bottom: 0.4rem;
        }
        .note-date {
          font-size: 0.8rem;
          color: #999;
          margin-bottom: 0.75rem;
        }
        .note-body {
          color: #444;
          font-size: 0.95rem;
          line-height: 1.6;
          white-space: pre-line;
        }
        .delete-btn {
          margin-top: 1rem;
          border: 1px solid #777;
          background: #fafafa;
          color: #444;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .delete-btn:hover {
          background: #f2f2f2;
        }
      </style>
      <div class="note-card">
        <div class="note-title">${title}</div>
        <div class="note-date">${date}</div>
        <div class="note-body">${body}</div>
        <button class="delete-btn" data-id="${id}">Hapus</button>
      </div>
    `;

    this.querySelector('.delete-btn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('note-deleted', {
        detail: { id },
        bubbles: true,
        composed: true
      }));
    });
  }
}

// === NOTES LIST ===
class NotesList extends HTMLElement {
  constructor() {
    super();
    this.notes = [...notesData];
  }

  connectedCallback() {
    this.render();
    document.addEventListener('note-added', (e) => {
      this.notes.unshift(e.detail);
      this.render();
    });
    this.addEventListener('note-deleted', (e) => {
      this.notes = this.notes.filter(note => note.id !== e.detail.id);
      this.render();
    });
  }

  render() {
    this.innerHTML = `
      <style>
        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }
        .empty {
          text-align: center;
          padding: 2rem;
          color: #888;
          font-size: 1rem;
        }
      </style>
      ${
        this.notes.length
          ? `<div class="notes-grid">${this.notes.map(note => `
              <note-item
                note-id="${note.id}"
                note-title="${note.title}"
                note-body="${note.body}"
                note-date="${note.createdAt}">
              </note-item>
            `).join('')}</div>`
          : `<div class="empty">Belum ada catatan.</div>`
      }
    `;
  }
}

// === REGISTER CUSTOM ELEMENTS ===
customElements.define('app-bar', AppBar);
customElements.define('note-form', NoteForm);
customElements.define('note-item', NoteItem);
customElements.define('notes-list', NotesList);
