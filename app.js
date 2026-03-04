require('dotenv').config()
require('express-async-errors')
const path = require('path')
const cookieParser = require('cookie-parser')

// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// connectDB
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')
// routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// if the application will be behind a proxy, as is the case in Heroku, we
// need to enable the trust proxy setting with the line of code below
app.set('trust proxy', 1)

app.use(
  rateLimiter({ 
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // limit each IP to 100 requests per windowMs
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(helmet())
app.use(cors())
app.use(xss())

// routes
// app.get('/', (req, res) => {
//   res.send('Jobs API')
// })
app.use('/auth', authRouter)
app.use('/jobs', authenticateUser, jobsRouter)

/* app.get('/', (req, res) => {
  res.render('index', { pageTitle: 'Jobs List' })
}) */
app.get('/', (req, res) => {
  res.redirect('/jobs')
})

app.use(express.static("public"));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
