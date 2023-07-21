export default ({ app, db, ceremony }) => {
  app.post('/join', async (req, res) => {
    try {
      const { token } = req.body
      if (!token) return res.status(400).json({ error: 'No token' })
      const auth = await db.findOne('Auth', {
        where: { token },
      })
      if (!auth) return res.status(401).json({ error: 'unauthorized' })
      const timeoutAt = await ceremony.addToQueue(auth.userId)
      const activeContributor = await ceremony.activeContributor()
      const queuePosition = await db.count('CeremonyQueue', {
        completedAt: null,
      })
      res.json({
        timeoutAt,
        active: activeContributor?.userId === auth.userId,
        queuePosition,
      })
    } catch (err) {
      console.log(err)
      res.status(500).end(err)
    }
  })
}
