const dotenv = require('dotenv').config()
const express = require('express')
const cors = require('cors');
const next = require('next')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const dbURI = process.env.MONGO_KEY;
const dodgeWarnings = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(dbURI, dodgeWarnings)
  .then(() => {
    app.prepare().then(() => {
      const server = express()
      server.use(cors())
      server.use(bodyParser.json());
      server.use(session({
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            collection: 'sessions'
        }),
        secret: 'shhh',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30
        }
    }))
    
      server.use(require('./server/api/user-routes'));
      server.use(require('./server/api/course-creation'));
      server.use(require('./server/api/view-course'));
      server.use(require('./server/api/lesson-routes/video-api'));
      server.use(require('./server/api/lesson-routes/text-api'));
      server.use(require('./server/api/lesson-routes/quiz-api'));
      server.use(require('./server/api/interaction-routes/lesson-interaction'));
      server.use(require('./server/api/setting-routes/language-routes'));
      server.use(require('./server/api/interaction-routes/interaction-likes'));
      server.use(require('./server/api/user-feedback/issue-report'));
    
      server.get('*', (req, res) => {
        return handle(req, res)
      })
    
      server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
      })
    })
  })
  .catch(err => console.log(error))