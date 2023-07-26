export default ({ app, db, ceremony }) => {
  app.get('/register', async (req, res) => {
    try {
      const user = await db.create('User', {})
      const auth = await db.create('Auth', {
        userId: user._id,
      })
      res.json(auth)
    } catch (err) {
      console.log(err)
      res.status(500).end(err)
    }
  })
}
