import { createFitness } from "../services/fitness.service.js";

export const fitnessController = async (req, res,next) => {
    try {
        const payload = req.body;
        const userData = req.auth
        const fitness = await createFitness(payload, userData);
    

        res.status(201).json({
            message: "Fitness profile created successfully",
       data:fitness,
       success:true
        });

    } catch (error) {
       next(error)
    }
}
