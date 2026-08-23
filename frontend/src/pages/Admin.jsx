import { useEffect, useState } from 'react';
import api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';

const LANGUAGES = ['Amharic', 'Afaan Oromoo', 'Tigrinya', 'International'];
const COLLECTIONS = ['Popular in Ethiopia', 'Ethiopian Movies', 'Ethiopian Series', 'Sheger Picks', 'International'];

const EMPTY_FORM = {
  title: '', description: '', type: 'movie', language: 'Amharic',
  releaseYear: '', durationMinutes: '', seasons: '', rating: '',
  isFeatured: false, collection: '', genreIds: [],
};

export default function Admin() {
  const [titles, setTitles] = useState(null);
  const [genres, setGenres] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadTitles() {
    const { data } = await api.get('/titles', { params: { limit: 200 } });
    setTitles(data.titles);
  }

  useEffect(() => {
    loadTitles().catch(() => setTitles([]));
    api.get('/titles/genres').then(({ data }) => setGenres(data.genres)).catch(() => {});
  }, []);

  function update(field) {
    return (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setForm((f) => ({ ...f, [field]: value }));
    };
  }

  function toggleGenre(id) {
    setForm((f) => ({
      ...f,
      genreIds: f.genreIds.includes(id) ? f.genreIds.filter((g) => g !== id) : [...f.genreIds, id],
    }));
  }

  function startEdit(t) {
    setEditingId(t.id);
    setForm({
      title: t.title, description: t.description || '', type: t.type, language: t.language,
      releaseYear: t.release_year || '', durationMinutes: t.duration_minutes || '',
      seasons: t.seasons || '', rating: t.rating || '', isFeatured: !!t.is_featured,
      collection: t.collection || '', genreIds: [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        releaseYear: form.releaseYear ? Number(form.releaseYear) : null,
        durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : null,
        seasons: form.seasons ? Number(form.seasons) : null,
        rating: form.rating ? Number(form.rating) : 0,
      };
      if (editingId) {
        await api.put(`/admin/titles/${editingId}`, payload);
      } else {
        await api.post('/admin/titles', payload);
      }
      resetForm();
      await loadTitles();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this title.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this title? This cannot be undone.')) return;
    await api.delete(`/admin/titles/${id}`);
    await loadTitles();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-sheger-muted">Add, edit, and remove movies and series.</p>

      {/* ---- Form ---- */}
      <form onSubmit={handleSubmit} className="mt-6 rounded-lg bg-sheger-surface p-4 sm:p-6 space-y-4">
        <h2 className="font-semibold">{editingId ? 'Edit Title' : 'Add New Title'}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required placeholder="Title" value={form.title} onChange={update('title')}
            className="rounded-md bg-sheger-card border border-white/10 px-3 py-2 text-sm"
          />
          <select value={form.type} onChange={update('type')} className="rounded-md bg-sheger-card border border-white/10 px-3 py-2 text-sm">
            <option value="movie">Movie</option>
            <option value="series">Series</option>
          </select>
          <select value={form.language} onChange={update('language')} className="rounded-md bg-sheger-card border border-white/10 px-3 py-2 text-sm">
            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={form.collection} onChange={update('collection')} className="rounded-md bg-sheger-card border border-white/10 px-3 py-2 text-sm">
            <option value="">No Collection</option>
            {COLLECTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" placeholder="Release Year" value={form.releaseYear} onChange={update('releaseYear')} className="rounded-md bg-sheger-card border border-white/10 px-3 py-2 text-sm" />
          {form.type === 'movie' ? (
            <input type="number" placeholder="Duration (minutes)" value={form.durationMinutes} onChange={update('durationMinutes')} className="rounded-md bg-sheger-card border border-white/10 px-3 py-2 text-sm" />
          ) : (
            <input type="number" placeholder="Seasons" value={form.seasons} onChange={update('seasons')} className="rounded-md bg-sheger-card border border-white/10 px-3 py-2 text-sm" />
          )}
          <input type="number" step="0.1" min="0" max="10" placeholder="Rating (0-10)" value={form.rating} onChange={update('rating')} className="rounded-md bg-sheger-card border border-white/10 px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isFeatured} onChange={update('isFeatured')} />
            Feature in Hero banner
          </label>
        </div>

        <textarea
          placeholder="Description" value={form.description} onChange={update('description')} rows={3}
          className="w-full rounded-md bg-sheger-card border border-white/10 px-3 py-2 text-sm"
        />

        <div>
          <p className="text-sm text-sheger-text/80 mb-1.5">Genres</p>
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <button
                type="button" key={g.id} onClick={() => toggleGenre(g.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${form.genreIds.includes(g.id) ? 'bg-sheger-red text-white' : 'bg-sheger-card text-sheger-text/70'}`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-sheger-red">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="rounded-md bg-sheger-red px-5 py-2 text-sm font-semibold hover:bg-sheger-red/90 disabled:opacity-50">
            {saving ? 'Saving…' : editingId ? 'Update Title' : 'Add Title'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-md bg-white/10 px-5 py-2 text-sm font-medium hover:bg-white/20">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ---- Titles table (horizontally scrollable on mobile) ---- */}
      <div className="mt-8">
        <h2 className="font-semibold mb-3">All Titles ({titles?.length ?? '…'})</h2>
        {titles === null && <LoadingSpinner />}
        {titles && (
          <div className="overflow-x-auto rounded-lg border border-white/5">
            <table className="min-w-[640px] w-full text-sm">
              <thead className="bg-sheger-surface text-sheger-muted text-left">
                <tr>
                  <th className="px-3 py-2.5 font-medium">Title</th>
                  <th className="px-3 py-2.5 font-medium">Type</th>
                  <th className="px-3 py-2.5 font-medium">Language</th>
                  <th className="px-3 py-2.5 font-medium">Year</th>
                  <th className="px-3 py-2.5 font-medium">Rating</th>
                  <th className="px-3 py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {titles.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02]">
                    <td className="px-3 py-2.5 font-medium">{t.title}</td>
                    <td className="px-3 py-2.5 capitalize">{t.type}</td>
                    <td className="px-3 py-2.5">{t.language}</td>
                    <td className="px-3 py-2.5">{t.release_year}</td>
                    <td className="px-3 py-2.5">{Number(t.rating).toFixed(1)}</td>
                    <td className="px-3 py-2.5 text-right whitespace-nowrap">
                      <button onClick={() => startEdit(t)} className="text-sheger-yellow hover:underline mr-3">Edit</button>
                      <button onClick={() => handleDelete(t.id)} className="text-sheger-red hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
