const router = require("express").Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const UserModel = require("../models/User.model");
const UbicacionModel = require("../models/Ubicacion.model");


// rutas de ubicaciones
//? GET "/api/ubicacion" => Lista todas las ubicaciones del usuario logueado
router.get("/", isAuthenticated, async (req, res, next) => {

    // con req.payload._id tenemos acceso al id del usuario logueado
    // console.log("usuario: ", req.payload._id);
    // es el req.session.user._id
  
    const idUsuario = req.payload._id;
  
      try {
          const listaUbicaciones = await UbicacionModel.find( {usuario: idUsuario} );
          
          if (listaUbicaciones.length === 0) {
            res.status(500).json( { errorMessage: "No hay ubicaciones" } )
          } else {
            res.json(listaUbicaciones);
          }  

      } catch (error) {
          next(error);
      }
  
  })
  
//? POST "/api/ubicacion/anadir" => Añade una ubicacion
router.post("/anadir", isAuthenticated, async (req, res, next) => {

    const { nombre } = req.body;

    const idUsuario = req.payload._id;
    
    if (!nombre) {
        res.status(400).json({ errorMessage: "Los campos no están completos" });
        return;
    }

    try {
        const foundUbicacion = await UbicacionModel.findOne( {nombre} )
        
        if (foundUbicacion !== null) {
            res.status(400).json( {errorMessage: "Ya existe otra ubicación con el mismo nombre"} )
            return;
        }

        await UbicacionModel.create({
            nombre,
            usuario: idUsuario
        })

        res.json("Todo bien, ubicación creada");

    } catch (error) {
        next(error)
    }

})







module.exports = router;
