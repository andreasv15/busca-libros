const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the ubicacion model to whatever makes sense in this case
const localizacionSchema = new Schema(
  {
    lugar: {
      type: String,
      required: true
    },
    // habitacion: {
    //   type: String,
    //   required: true
    // },
    // casa: {
    //   type: String,
    //   required: true
    // },
    // ciudad: {
    //   type: String,
    //   required: true
    // },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
  }
);

const Localizacion = model("localizacion", localizacionSchema);

module.exports = Localizacion;
