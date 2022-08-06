const express = require("express");
const { engine } = require("express-handlebars");
const session = require("express-session");
const fileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express();

const conn = require("./db/conn");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");

//receber resposta do body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//configurações de sessão
app.use(
  session({
    name: "session",
    secret: "nosso_secret",
    resave: false,
    saveUninitialized: false,
    store: new fileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  })
);

conn
  .sync()
  .then(() => {
    app.listen(3333);
  })
  .catch((err) => console.log(err));
