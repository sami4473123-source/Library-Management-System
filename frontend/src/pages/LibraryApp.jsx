
import { useEffect, useState } from "react";
import {
  Routes, Route, Navigate, NavLink, useNavigate
} from "react-router-dom";

import {
  LayoutDashboard, BookOpen, Users, ArrowLeftRight,
  Search, Bell, LogOut, LibraryBig, Plus, RotateCcw,
  Trash2, Pencil, X, Menu, AlertCircle, CheckCircle2,
  Sparkles
} from "lucide-react";

import api from "../services/api";

function App() {
  const [admin, setAdmin] = useState(() =>
    JSON.parse(localStorage.getItem("library_admin") || "null")
  );
  const [token, setToken] = useState(
    localStorage.getItem("library_token")
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("library_token");
    localStorage.removeItem("library_admin");
    setToken(null);
    setAdmin(null);
    navigate("/login");
  };

  if (!token) {
    return (
      <Routes>
        <Route
          path="/register"
          element={
            <AuthPage
              mode="register"
              onAuth={(data) => {
                setToken(data.token);
                setAdmin(data.admin);
              }}
            />
          }
        />
        <Route
          path="*"
          element={
            <AuthPage
              mode="login"
              onAuth={(data) => {
                setToken(data.token);
                setAdmin(data.admin);
              }}
            />
          }
        />
      </Routes>
    );
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <LibraryBig size={22} />
          </div>
          <div>
            <b>LIBRARY</b>
            <small>MANAGEMENT SYSTEM</small>
          </div>
        </div>

        <div className="side-label">WORKSPACE</div>

        <nav>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>
            <LayoutDashboard /> Overview
          </NavLink>

          <NavLink to="/books" onClick={() => setMenuOpen(false)}>
            <BookOpen /> Books
          </NavLink>

          <NavLink to="/members" onClick={() => setMenuOpen(false)}>
            <Users /> Members
          </NavLink>

          <NavLink to="/loans" onClick={() => setMenuOpen(false)}>
            <ArrowLeftRight /> Circulation
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <Sparkles size={17} />
            <b>Library insights</b>
            <p>
              Keep your collection organized and your readers happy.
            </p>
          </div>

          <button className="logout" onClick={logout}>
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>

      {menuOpen && (
        <div
          className="scrim"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-btn mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu />
          </button>

          <div className="crumb">
            Workspace <span>/</span> <b>Library management</b>
          </div>

          <div className="top-actions">
            <div className="status-pill">
              <i /> System online
            </div>

            <button className="icon-btn">
              <Bell size={18} />
            </button>

            <div className="avatar">
              {(admin?.name || "A").slice(0, 1).toUpperCase()}
            </div>

            <div className="admin-name">
              <b>{admin?.name || "Administrator"}</b>
              <small>Admin account</small>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/members" element={<Members />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function AuthPage({ mode, onAuth }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const register = mode === "register";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      if (register) {
        await api.post("/auth/register", form);

        const { data } = await api.post("/auth/login", {
          email: form.email,
          password: form.password
        });

        localStorage.setItem("library_token", data.token);
        localStorage.setItem(
          "library_admin",
          JSON.stringify(data.admin)
        );

        onAuth(data);
      } else {
        const { data } = await api.post("/auth/login", form);

        localStorage.setItem("library_token", data.token);
        localStorage.setItem(
          "library_admin",
          JSON.stringify(data.admin)
        );

        onAuth(data);
      }

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to connect. Check that the API is running."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow glow-one" />
      <div className="auth-glow glow-two" />

      <section className="auth-card">
        <div className="brand auth-brand">
          <div className="brand-mark">
            <LibraryBig />
          </div>

          <div>
            <b>LIBRARY</b>
            <small>MANAGEMENT SYSTEM</small>
          </div>
        </div>

        <div className="eyebrow">
          <Sparkles size={14} />
          YOUR LIBRARY, REIMAGINED
        </div>

        <h1>
          {register ? "Create your admin account." : "Welcome back."}
        </h1>

        <p className="muted">
          {register
            ? "Set up your workspace and start managing your collection."
            : "Sign in to access your library workspace."}
        </p>

        <form onSubmit={submit} className="auth-form">
          {register && (
            <Field
              label="Full name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              placeholder="Your name"
            />
          )}

          <Field
            label="Email address"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            placeholder="admin@example.com"
          />

          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            placeholder="At least 8 characters"
          />

          {error && (
            <div className="error-msg">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button className="primary-btn full" disabled={busy}>
            {busy
              ? "Please wait..."
              : register
                ? "Create account"
                : "Sign in"}
            <span>→</span>
          </button>
        </form>

        <p className="auth-switch">
          {register
            ? "Already have an account?"
            : "New to Library Management?"}

          {" "}
          <a href={register ? "/login" : "/register"}>
            {register ? "Sign in" : "Create admin account"}
          </a>
        </p>

        <div className="auth-foot">
          SECURE LIBRARY MANAGEMENT · BUILT FOR BETTER READING
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text"
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
      />
    </label>
  );
}

function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, note, tone = "blue" }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={20} />
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value ?? "—"}</div>
      <div className="stat-note">{note}</div>
    </div>
  );
}

function useNotice() {
  const [notice, setNotice] = useState("");

  const show = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 3200);
  };

  return [notice, show];
}

function Notice({ message }) {
  return message ? (
    <div className="toast">
      <CheckCircle2 size={17} />
      {message}
    </div>
  ) : null;
}

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard")
      .then((r) => setData(r.data))
      .catch((e) =>
        setError(
          e.response?.data?.message || "Could not load dashboard"
        )
      );
  }, []);

  return (
    <div className="content">
      <PageHeading
        eyebrow="OVERVIEW / DASHBOARD"
        title="Good to see you."
        description="Here’s what’s happening across your library today."
        action={
          <div className="date-chip">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric"
            })}
          </div>
        }
      />

      {error && <div className="error-msg">{error}</div>}

      <div className="stats-grid">
        <StatCard
          icon={BookOpen}
          label="BOOK TITLES"
          value={data?.books}
          note={`${data?.totalCopies ?? 0} total copies`}
          tone="blue"
        />

        <StatCard
          icon={Users}
          label="REGISTERED MEMBERS"
          value={data?.members}
          note="Active library members"
          tone="purple"
        />

        <StatCard
          icon={ArrowLeftRight}
          label="BOOKS ON LOAN"
          value={data?.activeLoans}
          note={`${data?.returnedLoans ?? 0} returned in total`}
          tone="green"
        />

        <StatCard
          icon={AlertCircle}
          label="OVERDUE RETURNS"
          value={data?.overdue}
          note="Needs your attention"
          tone="orange"
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel collection-panel">
          <div className="panel-head">
            <div>
              <h3>Collection snapshot</h3>
              <p>Availability across your library</p>
            </div>
            <span className="live-tag">
              <i /> LIVE
            </span>
          </div>

          <div className="collection-number">
            {data?.availableCopies ?? "—"}
            <small>
              {" "}/ {data?.totalCopies ?? "—"} copies available
            </small>
          </div>

          <div className="progress-track">
            <div
              style={{
                width: `${
                  data?.totalCopies
                    ? Math.min(
                        100,
                        (data.availableCopies / data.totalCopies) * 100
                      )
                    : 0
                }%`
              }}
            />
          </div>

          <div className="progress-legend">
            <span><i className="dot-blue" /> Available</span>
            <span><i className="dot-muted" /> Currently issued</span>
          </div>

          <div className="collection-bottom">
            <div>
              <b>{data?.activeLoans ?? "—"}</b>
              <small>Active loans</small>
            </div>
            <div>
              <b>{data?.overdue ?? "—"}</b>
              <small>Overdue</small>
            </div>
            <div>
              <b>{data?.members ?? "—"}</b>
              <small>Members</small>
            </div>
          </div>
        </section>

        <section className="panel quick-panel">
          <div className="panel-head">
            <div>
              <h3>Quick actions</h3>
              <p>Jump into your daily tasks</p>
            </div>
            <Sparkles size={18} className="subtle-icon" />
          </div>

          <div className="quick-links">
            <NavLink to="/books">
              <span className="quick-icon blue"><BookOpen /></span>
              <span>
                <b>Add a new book</b>
                <small>Grow your collection</small>
              </span>
              <b className="arrow">↗</b>
            </NavLink>

            <NavLink to="/members">
              <span className="quick-icon purple"><Users /></span>
              <span>
                <b>Register a member</b>
                <small>Welcome a new reader</small>
              </span>
              <b className="arrow">↗</b>
            </NavLink>

            <NavLink to="/loans">
              <span className="quick-icon green"><ArrowLeftRight /></span>
              <span>
                <b>Issue / return books</b>
                <small>Manage circulation</small>
              </span>
              <b className="arrow">↗</b>
            </NavLink>
          </div>
        </section>
      </div>

      <section className="panel recent-panel">
        <div className="panel-head">
          <div>
            <h3>Recent circulation</h3>
            <p>Your latest library activity</p>
          </div>
          <NavLink className="text-link" to="/loans">
            View all →
          </NavLink>
        </div>

        <LoanTable loans={data?.recentLoans || []} compact />
      </section>
    </div>
  );
}

function Books() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [notice, show] = useNotice();

  const load = () =>
    api.get("/books", { params: { search } })
      .then((r) => setItems(r.data))
      .catch((e) =>
        show(e.response?.data?.message || "Could not load books")
      );

  useEffect(() => {
    load();
  }, [search]);

  const save = async (form) => {
    try {
      if (modal?.item) {
        await api.put(`/books/${modal.item._id}`, form);
      } else {
        await api.post("/books", form);
      }

      setModal(null);
      show(modal?.item ? "Book updated" : "Book added to collection");
      load();
    } catch (e) {
      show(e.response?.data?.message || "Could not save book");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this book from the collection?")) return;

    try {
      await api.delete(`/books/${id}`);
      show("Book deleted");
      load();
    } catch (e) {
      show(e.response?.data?.message || "Could not delete book");
    }
  };

  return (
    <div className="content">
      <Notice message={notice} />

      <PageHeading
        eyebrow="COLLECTION / BOOKS"
        title="Your collection."
        description="Manage titles, track availability and keep your shelves in sync."
        action={
          <button className="primary-btn" onClick={() => setModal({})}>
            <Plus size={17} /> Add book
          </button>
        }
      />

      <div className="toolbar">
        <div className="search-box">
          <Search size={17} />
          <input
            placeholder="Search title, author or ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="result-count">{items.length} titles found</span>
      </div>

      <div className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>BOOK TITLE</th>
              <th>AUTHOR</th>
              <th>CATEGORY</th>
              <th>ISBN</th>
              <th>AVAILABILITY</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {items.map((b) => (
              <tr key={b._id}>
                <td>
                  <div className="book-cell">
                    <div className="book-cover"><BookOpen size={18} /></div>
                    <b>{b.title}</b>
                  </div>
                </td>
                <td>{b.author}</td>
                <td><span className="category-tag">{b.category}</span></td>
                <td className="muted-cell">{b.isbn || "—"}</td>
                <td>
                  <span className={`availability ${
                    b.availableCopies ? "available" : "unavailable"
                  }`}>
                    {b.availableCopies} / {b.totalCopies} available
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button title="Edit" onClick={() => setModal({ item: b })}>
                      <Pencil size={16} />
                    </button>
                    <button title="Delete" onClick={() => remove(b._id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!items.length && (
              <EmptyRow text="No books found. Add your first title to get started." />
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <BookModal
          item={modal.item}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function BookModal({ item, onClose, onSave }) {
  const [f, setF] = useState({
    title: item?.title || "",
    author: item?.author || "",
    isbn: item?.isbn || "",
    category: item?.category || "General",
    totalCopies: item?.totalCopies || 1
  });

  return (
    <Modal title={item ? "Edit book" : "Add a book"} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ ...f, totalCopies: Number(f.totalCopies) });
        }}
        className="modal-form"
      >
        <Field
          label="Book title"
          value={f.title}
          onChange={(v) => setF({ ...f, title: v })}
          placeholder="e.g. The Alchemist"
        />

        <Field
          label="Author"
          value={f.author}
          onChange={(v) => setF({ ...f, author: v })}
          placeholder="Author name"
        />

        <div className="form-grid">
          <Field
            label="ISBN (optional)"
            value={f.isbn}
            onChange={(v) => setF({ ...f, isbn: v })}
            placeholder="ISBN number"
          />

          <Field
            label="Category"
            value={f.category}
            onChange={(v) => setF({ ...f, category: v })}
            placeholder="Fiction"
          />
        </div>

        <Field
          label="Total copies"
          type="number"
          value={String(f.totalCopies)}
          onChange={(v) => setF({ ...f, totalCopies: v })}
          placeholder="1"
        />

        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-btn">Save book</button>
        </div>
      </form>
    </Modal>
  );
}

function Members() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [notice, show] = useNotice();

  const load = () =>
    api.get("/members", { params: { search } })
      .then((r) => setItems(r.data))
      .catch((e) =>
        show(e.response?.data?.message || "Could not load members")
      );

  useEffect(() => {
    load();
  }, [search]);

  const save = async (f) => {
    try {
      await api.post("/members", f);
      setModal(false);
      show("Member registered");
      load();
    } catch (e) {
      show(e.response?.data?.message || "Could not register member");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this member?")) return;

    try {
      await api.delete(`/members/${id}`);
      show("Member deleted");
      load();
    } catch (e) {
      show(e.response?.data?.message || "Could not delete member");
    }
  };

  return (
    <div className="content">
      <Notice message={notice} />

      <PageHeading
        eyebrow="PEOPLE / MEMBERS"
        title="The reading community."
        description="A home for every reader. Manage member profiles and registrations."
        action={
          <button className="primary-btn" onClick={() => setModal(true)}>
            <Plus size={17} /> Add member
          </button>
        }
      />

      <div className="toolbar">
        <div className="search-box">
          <Search size={17} />
          <input
            placeholder="Search name, email or member ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="result-count">{items.length} members</span>
      </div>

      <div className="member-grid">
        {items.map((m) => (
          <div className="member-card" key={m._id}>
            <div className="member-top">
              <div className="member-avatar">
                {m.name.slice(0, 1).toUpperCase()}
              </div>
              <span className="member-status"><i /> REGISTERED</span>
            </div>

            <h3>{m.name}</h3>
            <p>{m.email}</p>

            <div className="member-meta">
              <span>ID <b>{m.memberId}</b></span>
              <span>{m.department || "General"}</span>
            </div>

            <div className="member-footer">
              <span>{m.phone || "No phone added"}</span>
              <button
                onClick={() => remove(m._id)}
                title="Delete member"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {!items.length && (
          <div className="panel empty-state">
            No members found. Register your first reader.
          </div>
        )}
      </div>

      {modal && (
        <MemberModal
          onClose={() => setModal(false)}
          onSave={save}
        />
      )}
    </div>
  );
}

function MemberModal({ onClose, onSave }) {
  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    memberId: "",
    department: ""
  });

  return (
    <Modal title="Register a member" onClose={onClose}>
      <form
        className="modal-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(f);
        }}
      >
        <Field
          label="Full name"
          value={f.name}
          onChange={(v) => setF({ ...f, name: v })}
          placeholder="Member name"
        />

        <Field
          label="Email address"
          type="email"
          value={f.email}
          onChange={(v) => setF({ ...f, email: v })}
          placeholder="reader@email.com"
        />

        <div className="form-grid">
          <Field
            label="Member ID"
            value={f.memberId}
            onChange={(v) => setF({ ...f, memberId: v })}
            placeholder="LIB-001"
          />

          <Field
            label="Phone"
            value={f.phone}
            onChange={(v) => setF({ ...f, phone: v })}
            placeholder="Phone number"
          />
        </div>

        <Field
          label="Department"
          value={f.department}
          onChange={(v) => setF({ ...f, department: v })}
          placeholder="CSE / General"
        />

        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-btn">Register member</button>
        </div>
      </form>
    </Modal>
  );
}

function Loans() {
  const [items, setItems] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [notice, show] = useNotice();

  const load = () =>
    api.get("/loans", { params: { search } })
      .then((r) => setItems(r.data))
      .catch((e) =>
        show(e.response?.data?.message || "Could not load loans")
      );

  useEffect(() => {
    load();
  }, [search]);

  useEffect(() => {
    Promise.all([
      api.get("/books"),
      api.get("/members")
    ])
      .then(([b, m]) => {
        setBooks(b.data);
        setMembers(m.data);
      })
      .catch(() => {});
  }, []);

  const issue = async (f) => {
    try {
      await api.post("/loans", f);
      setModal(false);
      show("Book issued successfully");
      load();
    } catch (e) {
      show(e.response?.data?.message || "Could not issue book");
    }
  };

  const giveBack = async (id) => {
    try {
      const { data } = await api.patch(`/loans/${id}/return`);
      show(
        data.fine > 0
          ? `Book returned · ₹${data.fine} fine`
          : "Book returned successfully"
      );
      load();
    } catch (e) {
      show(e.response?.data?.message || "Could not return book");
    }
  };

  return (
    <div className="content">
      <Notice message={notice} />

      <PageHeading
        eyebrow="CIRCULATION / LOANS"
        title="Books in motion."
        description="Issue books to members, process returns and keep due dates visible."
        action={
          <button className="primary-btn" onClick={() => setModal(true)}>
            <Plus size={17} /> Issue a book
          </button>
        }
      />

      <div className="toolbar">
        <div className="search-box">
          <Search size={17} />
          <input
            placeholder="Search book or member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <span className="result-count">
          {items.filter((x) => x.status === "Issued").length} active loans
        </span>
      </div>

      <div className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>BOOK</th>
              <th>MEMBER</th>
              <th>ISSUED ON</th>
              <th>DUE DATE</th>
              <th>STATUS</th>
              <th>FINE</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {items.map((l) => {
              const late =
                l.status === "Issued" &&
                new Date(l.dueDate) < new Date();

              return (
                <tr key={l._id}>
                  <td>
                    <b>{l.book?.title || "Deleted book"}</b>
                    <small className="table-sub">
                      {l.book?.author || ""}
                    </small>
                  </td>

                  <td>
                    <b>{l.member?.name || "Deleted member"}</b>
                    <small className="table-sub">
                      {l.member?.memberId || ""}
                    </small>
                  </td>

                  <td>
                    {new Date(l.issueDate).toLocaleDateString("en-IN")}
                  </td>

                  <td>
                    {new Date(l.dueDate).toLocaleDateString("en-IN")}
                  </td>

                  <td>
                    <span className={`status-tag ${
                      l.status === "Returned"
                        ? "returned"
                        : late
                          ? "late"
                          : "issued"
                    }`}>
                      {late ? "Overdue" : l.status}
                    </span>
                  </td>

                  <td>₹{l.fine || 0}</td>

                  <td>
                    {l.status === "Issued" ? (
                      <button
                        className="return-btn"
                        onClick={() => giveBack(l._id)}
                      >
                        <RotateCcw size={14} /> Return
                      </button>
                    ) : (
                      <span className="muted-cell">Completed</span>
                    )}
                  </td>
                </tr>
              );
            })}

            {!items.length && (
              <EmptyRow
                text="No circulation records yet. Issue your first book."
                cols={7}
              />
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <IssueModal
          books={books.filter((b) => b.availableCopies > 0)}
          members={members}
          onClose={() => setModal(false)}
          onSave={issue}
        />
      )}
    </div>
  );
}

function IssueModal({ books, members, onClose, onSave }) {
  const [f, setF] = useState({
    bookId: "",
    memberId: "",
    dueDate: ""
  });

  const minDate = new Date(Date.now() + 86400000)
    .toISOString()
    .slice(0, 10);

  return (
    <Modal title="Issue a book" onClose={onClose}>
      <form
        className="modal-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(f);
        }}
      >
        <label className="field">
          <span>Choose book</span>
          <select
            required
            value={f.bookId}
            onChange={(e) =>
              setF({ ...f, bookId: e.target.value })
            }
          >
            <option value="">Select an available book</option>
            {books.map((b) => (
              <option key={b._id} value={b._id}>
                {b.title} — {b.availableCopies} available
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Choose member</span>
          <select
            required
            value={f.memberId}
            onChange={(e) =>
              setF({ ...f, memberId: e.target.value })
            }
          >
            <option value="">Select a member</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.memberId})
              </option>
            ))}
          </select>
        </label>

        <Field
          label="Due date"
          type="date"
          value={f.dueDate}
          onChange={(v) => setF({ ...f, dueDate: v })}
        />

        <p className="form-hint">
          Overdue fine: ₹5 per day by default.
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="primary-btn"
            disabled={!books.length || !members.length}
          >
            Confirm issue
          </button>
        </div>

        {(!books.length || !members.length) && (
          <p className="form-hint">
            Add at least one available book and one member before issuing.
          </p>
        )}
      </form>
    </Modal>
  );
}

function LoanTable({ loans }) {
  return (
    <div className="recent-list">
      {loans.map((l) => (
        <div className="recent-row" key={l._id}>
          <div className="recent-book">
            <div className="mini-cover">
              <BookOpen size={16} />
            </div>
            <span>
              <b>{l.book?.title || "Book"}</b>
              <small>{l.member?.name || "Member"}</small>
            </span>
          </div>

          <span className={`status-tag ${
            l.status === "Returned" ? "returned" : "issued"
          }`}>
            {l.status}
          </span>

          <small>
            {new Date(l.createdAt).toLocaleDateString("en-IN")}
          </small>
        </div>
      ))}

      {!loans.length && (
        <div className="empty-state">
          No recent activity to show yet.
        </div>
      )}
    </div>
  );
}

function EmptyRow({ text, cols = 6 }) {
  return (
    <tr>
      <td colSpan={cols}>
        <div className="empty-state">{text}</div>
      </td>
    </tr>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className="modal">
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={19} />
          </button>
        </div>

        {children}
      </section>
    </div>
  );
}

export default App;
