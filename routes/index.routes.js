const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)
const authRoutes = require("./auth.routes.js");
router.use("/auth", authRoutes);

const librosRoutes = require("./libro.routes.js");
router.use("/libros", librosRoutes);

const ubicacionesRoutes = require("./ubicacion.routes.js");
router.use("/ubicacion", ubicacionesRoutes);


module.exports = router;
