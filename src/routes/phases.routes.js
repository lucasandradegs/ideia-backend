const { Router } = require("express")
const PhaseController = require("../controller/PhaseController")

const phaseController = new PhaseController();
const phaseRoutes = Router()

phaseRoutes.post("/", phaseController.create)
phaseRoutes.put("/:id", phaseController.update)

module.exports = phaseRoutes