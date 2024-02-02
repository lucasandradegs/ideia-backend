const { Router } = require("express")
const SubPhaseController = require("../controller/SubPhaseController")

const subPhaseController = new SubPhaseController();
const subPhaseRoutes = Router()

subPhaseRoutes.post("/", subPhaseController.create)
subPhaseRoutes.put("/:id", subPhaseController.update)

module.exports = subPhaseRoutes