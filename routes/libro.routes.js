const router = require("express").Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const LibroModel = require("../models/Libro.model");
const UserModel = require("../models/User.model");

// rutas de libros
//? POST "/api/libros/anadir" => Agrega un libro
// router.post("/anadir", isAuthenticated, async (req, res, next) => {

//     const { imagen, titulo, autor, editorial } = req.body;

//     if (!imagen || !titulo || !autor || !editorial) {
//         res.status(400).json({ errorMessage: "Los campos no están completos" });
//         return;
//     }




// })



//? GET "/api/libros" => Lista todos los libros del usuario logueado
router.get("/", isAuthenticated, async (req, res, next) => {

  // con req.payload._id tenemos acceso al id del usuario logueado
  // console.log("usuario: ", req.payload._id);
  // es el req.session.user._id

  const idUsuario = req.payload._id;

    try {
        const listaLibros = await LibroModel.find( {usuario: idUsuario} ).select("titulo");
        res.json(listaLibros);

    } catch (error) {
        next(error);
    }

})




module.exports = router;
