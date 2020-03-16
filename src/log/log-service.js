const LogService = {
    getAllLog(knex) {
      return knex.select('*').from('climblog_log')
    },
    insertLog(knex, newLog) {
      return knex
        .insert(newLog)
        .into('climblog_log')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    getById(knex, id) {
      return knex.from('climblog_log').select('*').where('id', id).first()
    },
    deleteLog(knex, id) {
      return knex('climblog_log')
        .where({ id })
        .delete()
    },
    updateLog(knex, id, newClimbLogField) {
      return knex('climblog_log')
        .where({ id })
        .update(newClimbLogField)
    },
  }
  
  module.exports = LogService