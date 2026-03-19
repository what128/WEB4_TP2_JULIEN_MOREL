import Campsite from "../models/campsite.mjs";

export async function getCampsiteById(req, res){
    const id = req.params.id;
    try {
        const unCampSite = await Campsite.findById(id);

        if (unCampSite) {
            res.status(200).json({
                status: 200,
                message: "Site de campement récupéré avec succès",
                data: unCampSite,
                path: `/api/campsite/${id}`,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(404).json({
                status: 404,
                error: "Not Found",
                message: `Le site de campement avec l'id ${id} n'existe pas.`,
                path: `/api/campsite/${id}`,
                timestamp: new Date().toISOString()
            });
        }
    } catch(err) {
        res.status(500).json({
            status: 500,
            error: "Internal Server Error",
            message: "Erreur lors de la récupération du site de campement",
            path: `/api/campsite/${id}`,
            timestamp: new Date().toISOString(),
            details: err.message
        });
    }
}