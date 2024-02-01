const { Router } = require("express")
const ProcessController = require("../controller/ProcessController")

const processController = new ProcessController();
const processRoutes = Router()

processRoutes.post("/", processController.create)
processRoutes.get("/:id", processController.show)

module.exports = processRoutes