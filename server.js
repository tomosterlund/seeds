const express = require('express')
const next = require('next')

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

console.log('sdfsefes');

app.prepare().then(() => {
  const server = express()

  // const userRoutes = require('./server/api/user-routes');
  // server.use(userRoutes);
  server.use(require('./server/api/user-routes'));

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})