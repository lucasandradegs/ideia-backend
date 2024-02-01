const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class UsersController {
    async create(req, res) {
        const { name, numero, email } = req.body

        const checkIfUserExists = await knex("users").where({ email })

        if (checkIfUserExists.length > 0) {
            throw new AppError(`Endereço de e-mail já está cadastrado.`)
        }

        await knex("users").insert({ name, numero, email })

        return res.status(201).json(`Usuário cadastrado com sucesso!`)
    }
}

module.exports = UsersController;