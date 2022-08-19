const router = require("express").Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const UbicacionModel = require("../models/Localizacion.model");
const LibroModel = require("../models/Libro.model");


// rutas de localizaciones
//? GET "/api/localizaciones" => Lista todas las ubicaciones del usuario logueado
router.get("/", isAuthenticated, async (req, res, next) => {

    // con req.payload._id tenemos acceso al id del usuario logueado
    // console.log("usuario: ", req.payload._id);
    // es el req.session.user._id
  
    const idUsuario = req.payload._id;
  
      try {
            const listaUbicaciones = await UbicacionModel.find( {usuario: idUsuario} );
          
            if (listaUbicaciones.length === 0) {
                res.json( { errorMessage: "No hay localizaciones." } );
                return;
            }
        
            res.json(listaUbicaciones);
            

      } catch (error) {
          next(error);
      }
  
  })
  
//? POST "/api/localizaciones/anadir" => Añade una ubicacion
router.post("/anadir", isAuthenticated, async (req, res, next) => {

    // const { lugar, habitacion, casa, ciudad } = req.body;
    
    const { lugar } = req.body;

    const idUsuario = req.payload._id;
    
    // if (!lugar || !habitacion || !casa || !ciudad) {
    if (!lugar) {
        res.status(400).json({ errorMessage: "Los campos no están completos." });
        return;
    }

    try {
        // no podemos tener duplicadas localizaciones con los mismos campos
        // const foundUbicacion = await UbicacionModel.findOne( {lugar, habitacion, casa, ciudad} )
        const foundUbicacion = await UbicacionModel.findOne( {lugar} )

        if (foundUbicacion !== null) {
            res.status(400).json( {errorMessage: "Ya existe otra localización con los mismos valores."} )
            return;
        }

        await UbicacionModel.create({
            lugar, 
            // habitacion, 
            // casa, 
            // ciudad,
            usuario: idUsuario
        })

        res.json("Todo bien, localización creada.");

    } catch (error) {
        next(error)
    }

})

//? GET "/api/localizaciones/:id/" => Muestra detalles de la ubicacion


//? GET "/api/localizaciones/:id" => Muestra detalles de la ubicacion
router.get("/:id", isAuthenticated, async (req,res,next) => {
    const { id } = req.params;

    const idUsuario = req.payload._id;

    try {
        // const foundUbicacion = await UbicacionModel.findOne( { _id: id, usuario: idUsuario } );
        // console.log(foundUbicacion);
        // if (foundUbicacion === null ) {
        //     res.status(404).json( { errorMessage: "Ubicación no encontrada" } );
        //     return;
        // }

        // res.json(foundUbicacion);

        const foundUbicacion = await UbicacionModel.findById(id);
        if (foundUbicacion === null) {
            res.status(404).json( { errorMessage: "Localización no encontrada." } );
        } else {
            if (idUsuario != foundUbicacion.usuario) {
                res.status(400).json({ errorMessage: "Este usuario no es propietario de esta localización." });
                return;
            } else {
                const foundLibros = await LibroModel.find({ localizacion: id})
                if (foundLibros === null) {
                    res.status(400).json({ errorMessage: "Esta localización no tiene libros." });
                    return;     
                } else {
                    res.json({
                        localizacion: foundUbicacion,
                        libros: foundLibros
                    });

                }
                //res.json(foundUbicacion);

            }    
        }
        
    } catch (error) {
        next(error)
    }

})

//? PATCH "/api/localizaciones/:id" => Edita los detalles de la ubicacion
router.patch("/:id", isAuthenticated, async (req,res,next) => {

    const { id } = req.params;
    const { lugar } = req.body;

    const idUsuario = req.payload._id;

    if (!lugar) {
        res.status(400).json({ errorMessage: "Los campos no están completos." });
        return;
    }


    try {

        const foundUbicacion = await UbicacionModel.findById(id);
        if (idUsuario != foundUbicacion.usuario) {
            res.status(400).json({ errorMessage: "Este usuario no es propietario de esta localización." });
            return;
        } else {
            const updateUbicacion = await UbicacionModel.findByIdAndUpdate(id, {
                lugar
            }, {new: true} );
    
            res.json(updateUbicacion);    
        }

    } catch (error) {
        next(error);
    }
})


//? DELETE "/api/localizaciones/:id" => Borra la ubicacion
router.delete("/:id", isAuthenticated, async (req,res,next) => {
    
    const { id } = req.params;

    const idUsuario = req.payload._id;

    try {
        const foundLibros = await LibroModel.find( {localizacion: id} );

        if (foundLibros.length === 0) {
            const foundLocalizacion = await UbicacionModel.findById(id);
            if (idUsuario != foundLocalizacion.usuario) {
                res.status(400).json({ errorMessage: "Este usuario no es propietario de esta localización." });
                return;
            } else {
                await UbicacionModel.findByIdAndDelete(id);
                res.json("Localización borrada");
            }
        } else {
            res.json( { errorMessage: "Existen libros con esta localización, no es posible borrarla." } );
        }

        
    } catch (error) {
        next(error);
    }
})



module.exports = router;
