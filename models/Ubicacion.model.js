const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the ubicacion model to whatever makes sense in this case
const ubicacionSchema = new Schema(
  {
    nombre: {
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

const Ubicacion = model("ubicacion", ubicacionSchema);

module.exports = Ubicacion;
