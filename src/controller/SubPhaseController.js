const knex = require("../database/knex")
const AppError = require("../utils/AppError");

class SubPhaseController {
    async create(req, res) {
        const { name, done, phase_id } = req.body

        await knex("subphases").insert({ name, done, phase_id })

        return res.status(201).json(`Sub etapa cadastrada com sucesso!`)
    }

    async update(req, res) {
        const { name, done, phase_id } = req.body
        const { id } = req.params

        const subphase = await knex("subphases").where({ id }).first()

        if (!subphase) {
            throw new AppError(`Etapa não econtrada no sistema`)
        }

        // const previousPhase = await knex("phases")
        //     .where({ process_id: phase.process_id, id: phase.id - 1 })
        //     .first();

        // if (phase.id > 1 && (!previousPhase || previousPhase.done !== 1)) {
        //     throw new AppError("A etapa anterior precisa estar concluída antes de marcar esta etapa como concluída");
        // }

        subphase.name = name ?? subphase.name
        subphase.done = done ?? subphase.done
        subphase.phase_id = phase_id ?? subphase.phase_id

        await knex("subphases").update({ name, done, phase_id, updated_at: knex.fn.now() }).where({ id })

        return res.status(201).json(`Etapa atualizada com sucesso!`)
    }
}

module.exports = SubPhaseController;