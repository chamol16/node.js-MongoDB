const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const session = require("express-session");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const passport = require("passport");

//initializations
const app = express();
const PORT = 4000;
require("./database");
require("./config/passport");

//settings
app.set("port", PORT);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./libs/helpers"),
  })
);
app.set("view engine", ".hbs");

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    /* store: MongoStore.create({ mongoUrl: config.MONGODB_URI }), */  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//global variables
app.use((req, res, next) => {
  app.locals.success = req.flash("success");
  app.locals.fail = req.flash("fail");
  app.locals.user = req.user;
  app.locals.linkedIn = new URL(
    req.url,
    "https://www.linkedin.com/in/victor-vargas-b25916223"
  );
  next();
});

//routes
app.use(require("./routes"));
app.use(require("./routes/authentication"));
app.use(require("./routes/notes"));

//public or static files
app.use(express.static(path.join(__dirname, "public")));

//starting server
app.listen(app.get("port"), () => {
  console.log(`Server on port: ${PORT}`);
});
