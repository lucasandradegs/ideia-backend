const { Router } = require("express")
const ProcessController = require("../controller/ProcessController")

const processController = new ProcessController();
const processRoutes = Router()

processRoutes.post("/", processController.create)
processRoutes.get("/:param", processController.show);
processRoutes.get("/", processController.index)

module.exports = processRoutes