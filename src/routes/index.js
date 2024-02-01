const { Router } = require("express")

const usersRoutes = require("./users.routes")
const processRoutes = require("./process.routes")
const phaseRoutes = require("./phases.routes")

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/process", processRoutes)
routes.use("/phases", phaseRoutes)

module.exports = routes;