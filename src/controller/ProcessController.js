const knex = require("../database/knex")
const AppError = require("../utils/AppError");
const crypto = require("crypto")

class ProcessController {
    async create(req, res) {
        const { nome, user_id } = req.body

        const randomNumbers = crypto.randomBytes(4).readUInt32BE(0)
        const randomRastreio = `BR${randomNumbers.toString().padStart(8, '0')}`
        
        const newProcess = {
            rastreio: randomRastreio,
            nome,
            user_id
        }

        const [process_id] = await knex('process').insert(newProcess)

        return res.status(201).json({ rastreio: randomRastreio, process_id })
    }

    async show(req, res) {
        const { id } = req.params

        const process = await knex("process").where({ id }).first()
        const phases = await knex("phases").where({ process_id: id })

        if (!process) {
            throw new AppError(`Este processo não existe`)
        }

        return res.status(201).json({
            ...process,
            phases
        })
    }
}

module.exports = ProcessController;