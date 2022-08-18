const router = require("express").Router();
const UserModel = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middleware/isAuthenticated");
const { response } = require("express");

//? GET "/api/profile" => datos del usuario logueado
router.get("/", isAuthenticated, async (req,res,next) => {

    // console.log("req.pay ", req.payload);

    const idUsuario = req.payload._id;
    console.log(idUsuario)
    // console.log("idusu ", idUsuario);

    try {
        const foundUser = await UserModel.findOne({ _id: idUsuario });
        res.json(foundUser);
        
    } catch (error) {
        next(error);

    }
})

//? PATCH "/api/profile/:id" => editar datos del usuario 
router.patch("/:id", isAuthenticated, async (req,res,next) => {

    //const { id } = req.params;
    //console.log(id)
    //console.log(req.payload);
    const { nombre, password, newPassword, confirmPassword } = req.body;
    const idUsuario = req.payload._id;


    if (!nombre) {
        res.status(400).json("El nombre no puede estar vacío.");
        return;
    }
    // console.log(nombre);

    try {
        const foundUser = await UserModel.findOne({ idUsuario });

        //console.log(foundUser);

        // Comprobamos que la contraseña introducida es la correcta usando el metodo compare
        if (password) {

            const checkPassword = await bcryptjs.compare( password, foundUser.password );
            // console.log("password ", password);
            // console.log("foundUser.password ", foundUser.password);
            // console.log("check ", checkPassword)
            if (checkPassword === false) {
                res.status(400).json({ errorMessage: "La contraseña actual no es correcta." }); // status 401 --> sin autorizacion
                return;
            } else {
                if (newPassword && confirmPassword) {
                    if (newPassword !== confirmPassword) {
                        res.status(400).json({ errorMessage: "La nueva contraseña y la de confirmación no coinciden." }); // status 401 --> sin autorizacion
                        return;
                    } else {

                        //encriptamos la contraseña nueva
                        const salt = await bcryptjs.genSalt(10);
                        const hashPassowrd = await bcryptjs.hash(newPassword, salt);
                

                        const updateUser = await UserModel.findByIdAndUpdate(idUsuario, {
                            nombre,
                            password: hashPassowrd
                        }, {new: true} );

                        res.json("Contraseña modificada.");
                    }

                } else {
                    res.status(400).json({ errorMessage: "Escribe y confirma la nueva contraseña." }); // status 401 --> sin autorizacion
                    return;    
                }
                
            }
        } else {
            const updateUser = await UserModel.findByIdAndUpdate(idUsuario, {
                nombre
            }, {new: true} );
            res.json(updateUser);
        }
        
    } catch (error) {
        next(error);
    }
})



module.exports = router;