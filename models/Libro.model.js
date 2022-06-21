const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the libro model to whatever makes sense in this case
const libroSchema = new Schema(
  {
    imagen: {
        type: String,
        default: "https://elplacerdelalectura.com/wp-content/uploads/2020/10/libro-vacio-abierto-espacio-madera-espacio-texto_185193-1785.jpg"
    },
    titulo: {
      type: String,
      required: true,
      unique: true
    },
    autor: {
      type: String,
      required: true,
    },
    editorial: {
      type: String,
      required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    }
);

const Libro = model("libro", libroSchema);

module.exports = Libro;
