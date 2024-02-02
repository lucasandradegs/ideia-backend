const { Router } = require("express")

const usersRoutes = require("./users.routes")
const processRoutes = require("./process.routes")
const phaseRoutes = require("./phases.routes")
const subPhaseRoutes = require("./subphases.routes")

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/process", processRoutes)
routes.use("/phases", phaseRoutes)
routes.use("/subphases", subPhaseRoutes)

module.exports = routes;