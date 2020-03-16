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
  })
  })