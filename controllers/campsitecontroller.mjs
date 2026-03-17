import Campsite from "../models/Campsite";

export async function getCampsiteById(req, res){
    const id = req.params.id;
    try{
        const unCampSite = await Campsite.findById(id);

        if (unCampSite){
            res.status(200).json({
                message: "Site de campement récupéré avec succès",
                unCampSite
            })
        }
    }
    catch(err){
        res.status(500).json({
            message: "erreur lors de la récupération du site de campement",
            error: err.message
        })
    }
}