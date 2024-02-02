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
        let { param } = req.params;

        let process;

        if (!isNaN(parseInt(param))) {
        // Se o parâmetro for um número, assume que é um ID
        process = await knex("process").where({ id: param }).first();
    } else {
        // Senão, assume que é um rastreio
        process = await knex("process").where({ rastreio: param }).first();
    }

        if (!process) {
            throw new AppError(`Este processo não existe`);
        }

        const user = await knex("users").select("name").where({ id: process.user_id }).first();

        const phases = await knex("phases").where({ process_id: process.id });

        for (const phase of phases) {
            const subphases = await knex("subphases").where({ phase_id: phase.id });
            phase.subphases = subphases;
        }

        return res.status(201).json({
            ...process,
            user_name: user ? user.name : null,
            phases
        });
    }

    async index(req, res) {
        const { nome, rastreio } = req.query;

        let processes;

        if (rastreio) {
            processes = await knex("process")
                .select([
                    "process.id",
                    "process.nome",
                    "process.rastreio",
                    "users.name as user_name",
                    "phases.id as phase_id",
                    "phases.name as phase_name",
                    "phases.image as phase_image",
                    "subphases.id as subphase_id",
                    "subphases.name as subphase_name",
                    "subphases.done as subphase_done",
                ])
                .whereLike("process.nome", `%${nome}%`)
                .whereLike("process.rastreio", `%${rastreio}%`)
                .leftJoin("phases", "process.id", "phases.process_id")
                .leftJoin("subphases", "phases.id", "subphases.phase_id")
                .leftJoin("users", "process.user_id", "users.id")
                .orderBy("process.id")
                .orderBy("phases.id")
                .orderBy("subphases.id");
        } else {
            processes = await knex("process")
                .select([
                    "process.id",
                    "process.nome",
                    "process.rastreio",
                    "users.name as user_name",
                    "phases.id as phase_id",
                    "phases.name as phase_name",
                    "phases.image as phase_image",
                    "subphases.id as subphase_id",
                    "subphases.name as subphase_name",
                    "subphases.done as subphase_done",
                ])
                .whereLike("process.nome", `%${nome}%`)
                .leftJoin("phases", "process.id", "phases.process_id")
                .leftJoin("subphases", "phases.id", "subphases.phase_id")
                .leftJoin("users", "process.user_id", "users.id")
                .orderBy("process.id")
                .orderBy("phases.id")
                .orderBy("subphases.id");
        }

        const result = processes.reduce((acc, process) => {
            const existingProcess = acc.find((p) => p.id === process.id);

            if (!existingProcess) {
                acc.push({
                    id: process.id,
                    nome: process.nome,
                    rastreio: process.rastreio,
                    user_name: process.user_name,
                    phases: [],
                });
            }

            const existingPhase = acc.find((p) => p.id === process.id)
                .phases.find((ph) => ph.phase_id === process.phase_id);

            if (!existingPhase && process.phase_id) {
                acc.find((p) => p.id === process.id).phases.push({
                    phase_id: process.phase_id,
                    phase_name: process.phase_name,
                    phase_image: process.phase_image,
                    subphases: [],
                });
            }

            if (process.subphase_id) {
                acc.find((p) => p.id === process.id)
                    .phases.find((ph) => ph.phase_id === process.phase_id)
                    .subphases.push({
                        subphase_id: process.subphase_id,
                        subphase_name: process.subphase_name,
                        subphase_done: process.subphase_done,
                    });
            }

            return acc;
        }, []);

        return res.status(201).json(result);
    }
}

module.exports = ProcessController;