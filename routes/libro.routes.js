const router = require("express").Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const LibroModel = require("../models/Libro.model");

// rutas de libros

//? GET "/api/libros/:id" => Muestra los detalles de un libro
router.get("/:id", isAuthenticated, async (req,res,next) => {

    const { id } = req.params;
    const idUsuario = req.payload._id;

    try {

        const foundLibro = await LibroModel.findOne({ _id: id, usuario: idUsuario });
        // console.log("f libro: ", foundLibro);
        if (foundLibro === null) {
            res.status(404).json( { errorMessage: "Libro no encontrado" } );
            return;
        }

        res.json(foundLibro);
        
    } catch (error) {
        next(error);
    }
})


//? GET "/api/libros/localizacion/:localizacion" => Muestra los libros por localizacion
router.get("/localizacion/:localizacion", isAuthenticated, async (req,res,next) => {

    const { localizacion } = req.params;
    const idUsuario = req.payload._id;

    try {

        const foundLibro = await LibroModel.find({ localizacion, usuario: idUsuario });

        if (foundLibro === null) {
            res.status(404).json( { errorMessage: "Libro no encontrado" } );
            return;
        }

        res.json(foundLibro);
        
    } catch (error) {
        next(error);
    }
})



//? PATCH "/api/libros/:id" => Edita los detalles del libro
router.patch("/:id", isAuthenticated, async (req,res,next) => {

    const { id } = req.params;
    const { imagen, titulo, autor, sinopsis, localizacion, leido, esFavorito } = req.body;

    const idUsuario = req.payload._id;

    if (!imagen || !titulo || !autor || !sinopsis || !localizacion) {
        res.status(400).json({ errorMessage: "Los campos no están completos." });
        return;
    }

    try {

        const foundLibro = await LibroModel.findById(id);
        // console.log("idUsuario: ", idUsuario);
        // console.log("foundLibro: ", foundLibro.usuario);
        // console.log("es igual: ", idUsuario == foundLibro.usuario);

        //* Comprobamos que el usuario que edita el libro es el propietario
        if (idUsuario != foundLibro.usuario) {
            res.status(400).json({ errorMessage: "Este usuario no es propietario de este libro" });
            return;
        } else {
            const updateLibro = await LibroModel.findByIdAndUpdate(id, {
                imagen,
                titulo,
                autor,
                sinopsis,
                localizacion,
                leido,
                esFavorito
            }, {new: true} );
            res.json(updateLibro);
        }

    } catch (error) {
        next(error);
    }

})


//? DELETE "/api/libros/:id" => Borra el libro
router.delete("/:id", isAuthenticated, async (req, res, next) => {

    const { id } = req.params;
    const idUsuario = req.payload._id;

    try {
        const foundLibro = await LibroModel.findById(id);

                //* Comprobamos que el usuario que borra el libro es el propietario
        if (idUsuario != foundLibro.usuario) {
            res.status(400).json({ errorMessage: "Este usuario no es propietario de este libro." });
            return;
        } else {
            await LibroModel.findByIdAndDelete(id);
            res.json("Libro eliminado.");
        }

        
    } catch (error) {
        next(error);
    }

})

//? POST "/api/libros/anadir" => Agrega un libro
router.post("/anadir", isAuthenticated, async (req, res, next) => {

    const { imagen, titulo, autor, sinopsis, localizacion, leido, esFavorito } = req.body;
    const idUsuario = req.payload._id;

    if (!titulo || !autor || !sinopsis || !localizacion) {
        res.status(400).json({ errorMessage: "Los campos no están completos." });
        return;
    }

    try {
        // primero buscamos algun libro con el mismo nombre y autor, para evitar duplicados
        const foundLibro = await LibroModel.findOne({titulo, autor}); 
        //console.log("encontrado: ", foundLibro);
        if (foundLibro !== null) {
            res.status(400).json( { errorMessage: "No se puede añadir un libro con el mismo título y nombre de autor" } )
            return;
        }

        await LibroModel.create({
            imagen,
            titulo,
            autor,
            sinopsis,
            usuario: idUsuario,
            localizacion,
            leido,
            esFavorito
        })

        res.json("Todo bien, libro añadido")
        
    } catch (error) {
        next(error);
    }

})


//? GET "/api/libros" => Lista todos los libros del usuario logueado
router.get("/", isAuthenticated, async (req, res, next) => {

  // con req.payload._id tenemos acceso al id del usuario logueado
  // console.log("usuario: ", req.payload._id);
  // es el req.session.user._id

  const idUsuario = req.payload._id;

    try {
        const listaLibros = await LibroModel.find( {usuario: idUsuario} );

        //console.log("length: ", listaLibros.length)
        
        if (listaLibros.length === 0) {
            res.json( { errorMessage: "No tienes libros." } )
            return;
        }

        res.json(listaLibros);

    } catch (error) {
        next(error);
    }

})




module.exports = router;
