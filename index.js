const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const Filestore = require('session-file-store')(session);
const flash = require('express-flash');

const app = express();

const conn = require('./db/conn');

// Models
const Idea = require('./models/Idea');
const User = require('./models/User');

// Import Routes
const ideasRoutes = require('./routes/ideasRoutes');
const authRoutes = require('./routes/authRoutes');

// Import Controller
const IdeaController = require('./controllers/IdeaController');

// template engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// receber resposta do body
app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

// session midleware
app.use(
    session({
        name: 'session',
        secret: 'nosso secret',
        resave: false,
        saveUninitialized: false,
        store: new Filestore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    }),
)

// flash messages
app.use(flash())

// public path
app.use(express.static('public'));

// set session to res
app.use((req, res, next) => {
    if(req.session.userid) {
        res.locals.session = req.session;
    }

    next();
});

// Routes
app.use('/ideas', ideasRoutes);
app.use('/', authRoutes);

app.use('/', IdeaController.showIdeas);


conn
.sync({ force: true })
//.sync()
.then(() => {
    app.listen(3000)
})
.catch((err) => console.log(err));
