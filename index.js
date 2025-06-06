const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'apc-secret',
  resave: false,
  saveUninitialized: true
}));

function loadPages() {
  try {
    const data = fs.readFileSync('pages.json');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function savePages(pages) {
  fs.writeFileSync('pages.json', JSON.stringify(pages, null, 2));
}

app.get('/', (req, res) => {
  const pages = loadPages();
  res.render('index', { pages });
});

app.get('/page/:slug', (req, res) => {
  const pages = loadPages();
  const page = pages.find(p => p.slug === req.params.slug);
  if (!page) return res.status(404).send('Page not found');
  res.render('page', { page, pages });
});

// Admin login
app.get('/admin/login', (req, res) => {
  res.render('admin/login');
});

app.post('/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === (process.env.ADMIN_PASSWORD || 'admin')) {
    req.session.loggedIn = true;
    return res.redirect('/admin');
  }
  res.render('admin/login', { error: 'รหัสผ่านไม่ถูกต้อง' });
});

function ensureAuth(req, res, next) {
  if (req.session.loggedIn) return next();
  res.redirect('/admin/login');
}

// Admin dashboard
app.get('/admin', ensureAuth, (req, res) => {
  const pages = loadPages();
  res.render('admin/dashboard', { pages });
});

app.get('/admin/add', ensureAuth, (req, res) => {
  res.render('admin/add_page');
});

app.post('/admin/add', ensureAuth, (req, res) => {
  const { title, slug, content } = req.body;
  const pages = loadPages();
  pages.push({ title, slug, content });
  savePages(pages);
  res.redirect('/admin');
});

app.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});
