
const express = require('express')
const cookieParser = require('cookie-parser')
const createReadStream = require('fs').createReadStream
const bodyParser = require('body-parser')
const randomBytes = require('crypto').randomBytes

const app = express()
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))

const SAME_SITE = process.env.SAME_SITE || 'Lax'

const USERS = { alice: 'password', jessica: '50505' }
const BALANCES = { alice: 500, jessica: 10000 }
const SESSIONS = {} // sessionId -> username

app.get('/', (req, res) => {
  const sessionId = req.cookies.sessionId
  const username = SESSIONS[sessionId]

  if (username) {
    res.send(`
      <h2>Chase Bank</h2>
      Hi ${username}. Your balance is $${BALANCES[username]}.
      <form method='POST' action='/transfer'>
        Send amount:
        <input name='amount' />
        To user:
        <input name='to' />
        <input type='submit' value='Send' />
      </form>
      <p><a href='/logout'>Logout</a></p>
    `)
  } else {
    createReadStream('index.html').pipe(res)
  }
})

app.post('/login', (req, res) => {
  const username = req.body.username
  const password = USERS[username]

  if (password === req.body.password) {
    const sessionId = randomBytes(16).toString('hex')
    SESSIONS[sessionId] = username

    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      sameSite: SAME_SITE
    })

    res.redirect('/')
  } else {
    res.send('fail!')
  }
})

app.get('/logout', (req, res) => {
  const sessionId = req.cookies.sessionId
  delete SESSIONS[sessionId]
  res.clearCookie('sessionId')
  res.redirect('/')
})

app.post('/transfer', (req, res) => {
  const sessionId = req.cookies.sessionId
  const username = SESSIONS[sessionId]

  if (!username) {
    res.send('fail! No valid session cookie received.')
    return
  }

  const amount = Number(req.body.amount)
  const to = req.body.to

  if (!Number.isFinite(amount) || amount <= 0 ||
      BALANCES[to] === undefined || BALANCES[username] < amount) {
    res.send('Invalid transfer.')
    return
  }

  BALANCES[username] -= amount
  BALANCES[to] += amount

  res.redirect('/')
})

app.listen(4000, () => {
  console.log(`Banking server running on port 4000 (SameSite=${SAME_SITE})`)
})
