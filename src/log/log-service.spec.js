const LogService = require('./log-service')
const knex = require('knex')

describe(`Log service object`, function() {
    let db
    let testLog = [
        {
            id: 1,
            climb_type: 'Bouldering (Indoor)',
            difficulty: 'V5',
            attempts: 9,
            rating: 5
          },
          {
            id: 2,
            climb_type: 'Bouldering (Indoor)',
            difficulty: 'V3',
            attempts: 15,
            rating: 3
          },
          {
            id: 3,
            climb_type: 'Bouldering (Indoor)',
            difficulty: 'V3',
            attempts: 8,
            rating: 3
          }
    ]
  before(() => db('climblog_log').truncate())  

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })

  after(() => db.destroy())   
    
  context(`Given 'climblog_log' has data`, () => {
    beforeEach(() => {
      return db
        .into('climblog_log')
        .insert(testLog)
    })
  
    it(`insertLog() inserts a log and resolves the log with an 'id'`, () => {
      const newLog = {
        climb_type: 'Boulder',
        difficulty: 'V5',
        attempts: 5,
        rating: 5
      }
      return LogService.insertLog(db, newLog)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            climb_type: 'Boulder',
            difficulty: 'V5',
            attempts: 5,
            rating: 5
          })
        })
    })  
    
    it(`getAllLog() resolves all log from 'climblog_log' table`, () => {
    return LogService.(db)
      .then(actual => {
        
        expect(actual).to.eql(testLog.map(log => ({
            ...log,
        })))
      })  
    })
  it(`deleteLog() removes a log by id from 'climblog_log' table`, () => {
        const logId = 3
        return LogService.deleteLog(db, logId)
          .then(() => LogService.getAllLog(db))
          .then(getAllLog => {
            // copy the test articles array without the "deleted" article
            const expected = testLog.filter(Log => log.id !== logId)
            expect(allLog).to.eql(expected)
          })
      })  

  context(`Given 'climblog_log' has no data`, () => {
        it(`getAllLog() resolves an empty array`, () => {
           return LogService.getAllLog(db)
             .then(actual => {
               expect(actual).to.eql([])
             })
         })
       }) 

  describe(`POST /log`, () => {
      it(`creates a log, responding with 201 and the new log`, function() {
        this.retries(3)
        const newLog = {
            title: 'Test new log',
            style: 'Listicle',
            content: 'Test new log content...'
          }  
        return supertest(app)
          .post('/log')
          .sent(newLog)
          .expect(201)
          .expect(res => {
              expect(res.body.title).to.eql(newArticle.title)
              expect(res.body.style).to.eql(newArticle.style)
              expect(res.body.content).to.eql(newArticle.content)
              expect(res.body).to.have.property('id')
              expect(res.headers.location).to.eql(`/log/${res.body.id}`)
            })
            .then(postRes =>
                supertest(app)
                  .get(`/log/${postRes.body.id}`)
                  .expect(postRes.body)
            )
      })

    describe(`DELETE /log/:log_id`, () => {
      context(`Given no logs`, () => {
          it(`responds with 404`, () => {
            const logId = 123456
            return supertest(app)
              .delete(`/log/${logId}`)
              .expect(404, { error: { message: `Log doesn't exist` } })
          })
        })
        context('Given there are logs in the database', () => {
          const testLog = makeLogArray()
                beforeEach('insert log', () => {
            return db
              .into('climblog_log')
              .insert(testLog)
          })
                it('responds with 204 and removes the article', () => {
            const idToRemove = 2
            const expectedLog = testLog.filter(log => log.id !== idToRemove)
            return supertest(app)
              .delete(`/log/${idToRemove}`)
              .expect(204)
              .then(res =>
                supertest(app)
                  .get(`/log`)
                  .expect(expectedLog)
              )
          })
        })


      const requiredFields = ['climb_type', 'difficulty', 'attempts', 'rating']
      requiredFields.forEach(field => {
        const newLog = {
          title: 'Test new article',
          style: 'Listicle',
          content: 'Test new article content...'
        }
        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
          delete newLog[field]
          return supertest(app)
            .post('/log')
            .send(newLog)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` }
            })
        })
      })
           
    })
  
  describe(`GET /log/:log_id`, () => {

  context('Given there are logs in the database', () => {/* not shown */})
  
  context(`Given an XSS attack log`, () => {
    const maliciousLog = {
      id: 911,
      climb_type: 'Naughty naughty very naughty <script>alert("xss");</script>',
      difficulty: 'V9',
      attempts: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
      rating: '5'
    }
    beforeEach('insert malicious log', () => {
      return db
        .into('climblog_log')
        .insert([ maliciousLog ])
    })
    it('removes XSS attack content', () => {
      return supertest(app)
        .get(`/log/${maliciousLog.id}`)
        .expect(200)
        .expect(res => {
          expect(res.body.climb_type).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
          expect(res.body.attempts).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
        })
    })
  })  
       
  })
  })