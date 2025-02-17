const Reserva = require("../models/itinerarioModelo");
const mongoose = require("mongoose");

const crearReserva = async (req, res) => {
  const { userId, vueloIda, vueloVuelta, hotel, checklist, destino } = req.body;
  // console.log("Datos recibidos:", req.body);

  if (!vueloIda || !vueloVuelta) {
    console.log(
      `Datos de vuelo incompletos - vueloIda: ${vueloIda}, vueloVuelta: ${vueloVuelta}`
    );
    return res.status(400).json({ msg: "Los datos de vuelo son obligatorios" });
  }

  try {
    console.log("Datos recibidos:", {
      userId,
      vueloIda,
      vueloVuelta,
      hotel,
      destino,
      checklist,
    });

    const nuevaReserva = new Reserva({
      userId,
      vueloIda,
      vueloVuelta,
      hotel: hotel || null,
      destino,
      checklist: checklist || [],
    });

    // console.log("Nueva reserva:", nuevaReserva);

    const reservaGuardada = await nuevaReserva.save();

    // console.log("Reserva guardada:", reservaGuardada);

    res
      .status(200)
      .json({ msg: "Reserva creada exitosamente", data: reservaGuardada });
  } catch (error) {
    console.log("Error al crear la reserva:", error.message);
    res
      .status(500)
      .json({ msg: "Error al crear la reserva", error: error.message });
  }
};

const actualizarReserva = async (req, res) => {
  const { id } = req.params;
  const { vueloIda, vueloVuelta, hotel, checklist } = req.body;

  try {
    const reserva = await Reserva.findByIdAndUpdate(
      id,
      { vueloIda, vueloVuelta, hotel: hotel || null, checklist },
      { new: true, runValidators: true }
    );

    if (!reserva) {
      return res.status(404).json({ msg: "Reserva no encontrada" });
    }

    res.status(200).json({ msg: "Reserva actualizada", data: reserva });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al actualizar la reserva", error: error.message });
  }
};

const agregarItem = async (req, res) => {
  try {
    const { id, titulo } = req.body;

    // console.log("Datos recibidos:", { id, titulo });

    const reserva = await Reserva.findById(id);
    if (!reserva) {
      console.log("Reserva no encontrada");
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    // console.log("Reserva encontrada:", reserva);

    const nuevoItem = { titulo, estado: 'pendiente' };
    // console.log("Nuevo ítem a agregar:", nuevoItem);

    reserva.checklist.push(nuevoItem);
    // console.log("Checklist actualizado:", reserva.checklist);

    await reserva.save();
    console.log("Reserva guardada con éxito");

    res.status(200).json(reserva.checklist);
  } catch (err) {
    console.error("Error en agregarItem:", err);
    res.status(500).json({ message: "Error al agregar el ítem" });
  }
};

const actualizarItem = async (req, res) => {
    try {
        const { id, itemId, estado } = req.body; 

        console.log("ID de la reserva:", id);
        console.log("ID del ítem a actualizar:", itemId);
        console.log("Nuevo estado:", estado);

        const reserva = await Reserva.findById(id);
        if (!reserva) return res.status(404).json({ error: "Reserva no encontrada" });

        const item = reserva.checklist.find(item => item._id.toString() === itemId);
        if (item) {
            item.estado = estado; 
            console.log("Ítem actualizado:", item);
        } else {
            return res.status(404).json({ error: "Ítem no encontrado" });
        }

        await reserva.save();
        res.status(200).json({ message: "Ítem actualizado correctamente", checklist: reserva.checklist });
    } catch (error) {
        console.error("Error actualizando ítem:", error);
        res.status(500).json({ error: "Error al actualizar el ítem" });
    }
};
 
  const eliminarItem = async (req, res) => {
    try {
      const { id, itemId } = req.body;
  
      console.log("Datos recibidos para eliminar:", { id, itemId });
  
      const reserva = await Reserva.findById(id);
      if (!reserva) {
        console.log("Reserva no encontrada");
        return res.status(404).json({ message: "Reserva no encontrada" });
      }
  
      console.log("Reserva encontrada:", reserva);
  
      const index = reserva.checklist.findIndex(item => item._id.toString() === itemId);
  
      if (index === -1) {
        console.log("Item no encontrado en el checklist");
        return res.status(404).json({ message: "Item no encontrado" });
      }
  
      reserva.checklist.splice(index, 1);
      console.log("Checklist después de eliminar:", reserva.checklist);
  
      await reserva.save();
      console.log("Reserva guardada con éxito después de eliminar el ítem");
  
      res.status(200).json(reserva.checklist);
    } catch (err) {
      console.error("Error en eliminarItem:", err);
      res.status(500).json({ message: "Error al eliminar el ítem" });
    }
  };
  

const obtenerReservaUserId = async (req, res) => {
  const { userId } = req.params;

  console.log(
    "📌 Solicitud recibida para obtener reservas del usuario con ID:",
    userId
  );

  if (!userId) {
    console.log("❌ Error: ID de usuario no proporcionado");
    return res.status(400).json({ msg: "ID de usuario no proporcionado" });
  }

  try {
    console.log("🔍 Buscando reservas en la base de datos...");
    const reservas = await Reserva.find({ userId });

    if (!reservas.length) {
      console.log(`⚠️ No se encontraron reservas para el usuario ${userId}`);
      return res
        .status(404)
        .json({ msg: "No se encontraron reservas para este usuario" });
    }

    console.log("✅ Reservas encontradas:", reservas);
    res.status(200).json({ msg: "Reservas obtenidas", data: reservas });
  } catch (error) {
    console.error("❌ Error al obtener las reservas:", error);
    res
      .status(500)
      .json({ msg: "Error al obtener las reservas", error: error.message });
  }
};

const obtenerItinerarioId = async (req, res) => {
  try {
    const { id } = req.params;

    const itinerario = await Reserva.findById(id);

    if (!itinerario) {
      return res.status(404).json({ message: "Itinerario no encontrado" });
    }

    return res.status(200).json(itinerario);
  } catch (error) {
    console.error("Error al obtener el itinerario:", error);
    return res
      .status(500)
      .json({ message: "Hubo un problema al obtener el itinerario" });
  }
};

const obtenerReservaDestino = async (req, res) => {
  const { destino } = req.query;

  if (!destino) {
    return res.status(400).json({ msg: "Destino no proporcionado" });
  }

  try {
    const reservas = await Reserva.find({ destino });

    if (reservas.length === 0) {
      return res
        .status(404)
        .json({ msg: "No se encontraron reservas para este destino" });
    }

    res.status(200).json({ msg: "Reservas obtenidas", data: reservas });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Error al obtener las reservas", error: error.message });
  }
};

const borrarReserva = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "ID de reserva no válido" });
  }

  try {
    const reservaEliminada = await Reserva.findByIdAndDelete(id);

    if (!reservaEliminada) {
      return res.status(404).json({ msg: "Reserva no encontrada" });
    }

    res
      .status(200)
      .json({ msg: "Reserva eliminada correctamente", data: reservaEliminada });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al eliminar la reserva", error: error.message });
  }
};

module.exports = {
  crearReserva,
  obtenerReservaDestino,
  obtenerReservaUserId,
  obtenerItinerarioId,
  borrarReserva,
  actualizarReserva,
  agregarItem,
  actualizarItem,
  eliminarItem,
};
