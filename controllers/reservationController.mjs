import Reservation from "../models/reservation.mjs";

export async function getReservationById(req, res){
    const id = req.params.id;
    try{
        const uneReservation = await Reservation.findById(id);

        if (uneReservation){
            res.status(200).json({
                status: 200,
                message: "Site de campement récupéré avec succès",
                data : unCampSite,
                path: `/api/reservation/${id}`,
                timestamp: new Date().toISOString()              
            });
        }
        else{
            res.status(404).json({
                status: 404,
                error: "Ressource introuvable",
                message: `La réservation avec l'id ${id} n'existe pas.`,
                path: `/api/reservation/${id}`,
                timestamp: new Date().toISOString()
            });
        }
    }
    catch(err){
        res.status(500).json({
            status: 500,
            error: "Erreur interne du serveur",
            message: "Erreur lors de la récupération du site de campement",
            path: `/api/reservation/${id}`,
            timestamp: new Date().toISOString(),
            details: err.message
        })
    }
}