const knex = require("../database/knex")
const AppError = require("../utils/AppError");

class PhaseController {
    async create(req, res) {
        const { name, done, process_id } = req.body

        await knex("phases").insert({ name, done, process_id })

        return res.status(201).json(`Etapa cadastrada com sucesso!`)
    }

    async update(req, res) {
        const { name, done, process_id } = req.body
        const { id } = req.params

        const phase = await knex("phases").where({ id }).first()

        if (!phase) {
            throw new AppError(`Etapa não econtrada no sistema`)
        }

        // const previousPhase = await knex("phases")
        //     .where({ process_id: phase.process_id, id: phase.id - 1 })
        //     .first();

        // if (phase.id > 1 && (!previousPhase || previousPhase.done !== 1)) {
        //     throw new AppError("A etapa anterior precisa estar concluída antes de marcar esta etapa como concluída");
        // }

        phase.name = name ?? phase.name
        phase.done = done ?? phase.done
        phase.process_id = process_id ?? phase.process_id

        await knex("phases").update({ name, done, process_id, updated_at: knex.fn.now() }).where({ id })

        return res.status(201).json(`Etapa atualizada com sucesso!`)
    }
}

module.exports = PhaseController;