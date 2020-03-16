const path = require('path')
const express = require('express')
const xss = require('xss')
const LogService = require('./log-service')

const logRouter = express.Router()
const jsonParser = express.json()

const serializeLog = log => ({
  id: log.id,
  climb_type: xss(log.climb_type),
  difficulty: log.difficulty,
  attempts: log.attempts,
  rating: log.rating
})

logRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    LogService.getAllLog(knexInstance)
      .then(log => {
        res.json(log.map(serializeLog))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { climb_type, difficulty, attempts, rating } = req.body
    const newLog = { climb_type, difficulty, attempts, rating }

    for (const [key, value] of Object.entries(newLog))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    //   newArticle.author = author  
    //   ArticlesService.insertArticle(
    //   req.app.get('db'),
    //   newArticle
    // )
      .then(log => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${article.id}`))
          .json(serializeArticle(article))
      })
      .catch(next)
  })

// logRouter
//   .route('/:article_id')
//   .all((req, res, next) => {
//     ArticlesService.getById(
//       req.app.get('db'),
//       req.params.article_id
//     )
//       .then(article => {
//         if (!article) {
//           return res.status(404).json({
//             error: { message: `Article doesn't exist` }
//           })
//         }
//         res.article = article
//         next()
//       })
//       .catch(next)
//   })
//   .get((req, res, next) => {
//     res.json(serializeArticle(res.article))
//   })
//   .delete((req, res, next) => {
//     ArticlesService.deleteArticle(
//       req.app.get('db'),
//       req.params.article_id
//     )
//       .then(numRowsAffected => {
//         res.status(204).end()
//       })
//       .catch(next)
//   })
//   .patch(jsonParser, (req, res, next) => {
//     const { title, content, style } = req.body
//     const articleToUpdate = { title, content, style }

//     const numberOfValues = Object.values(articleToUpdate).filter(Boolean).length
//     if (numberOfValues === 0)
//       return res.status(400).json({
//         error: {
//           message: `Request body must content either 'title', 'style' or 'content'`
//         }
//       })

//     ArticlesService.updateArticle(
//       req.app.get('db'),
//       req.params.article_id,
//       articleToUpdate
//     )
//       .then(numRowsAffected => {
//         res.status(204).end()
//       })
//       .catch(next)
//   })

module.exports = logRouter