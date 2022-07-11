const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the libro model to whatever makes sense in this case
const libroSchema = new Schema(
  {
    imagen: {
        type: String,
        default: "https://res.cloudinary.com/dmrjy3ynh/image/upload/v1657049201/busca-libros/book.jpg"
    },
    titulo: {
      type: String,
      required: true
    },
    autor: {
      type: String,
      required: true,
    },
    sinopsis: {
      type: String,
      required: true
    },
    // categoria: [{
    //   type: String
    // }],
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    localizacion: {
      type: Schema.Types.ObjectId,
      ref: "localizacion",
      required: true
    }
  }
);

const Libro = model("libro", libroSchema);

module.exports = Libro;
