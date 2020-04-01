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
.route('/log')
.all((req, res, next) => {
    LogService.getById(
      req.app.get('db'),
      req.params.log_id
    )
    .delete((req, res, next) => {
      res.status(204).end()
  })     
      .then(log => {
        if (!log) {
          return res.status(404).json({
            error: { message: `Log doesn't exist` }
          })
        }
        res.log = log 
        next() 
      })
      .catch(next)
  })
// .get((req, res, next) => {
//   res.json({
//     id: res.log.id,
//     climb_type: xss(res.log.climb_type),
//     difficulty: res.log.difficulty,
//     attempts: res.log.attempts,
//     rating: res.log.rating
//   }
// })
.get((req, res, next) => {
  const knexInstance = req.app.get('db')
  LogService.getAllLog(knexInstance)
    .then(log => {
      res.json(log.map(serializeLog))
    })
    .catch(next)
})
.delete((req, res, next) => {
  LogService.deleteLog(
      req.app.get('db'),
      req.params.log_id
  )
      .then(() => {
        res.status(204).end()
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

logRouter
  .route('/:log_id')
  .all((req, res, next) => {
    LogService.getById(
      req.app.get('db'),
      req.params.log_id
    )
    .delete((req, res, next) => {
      res.status(204).end()
  })    
      .then(log => {
        if (!log) {
          return res.status(404).json({
            error: { message: `Log doesn't exist` }
          })
        }
        res.article = log
        next()
      })
      .catch(next)
  })
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