import mongoose from 'mongoose';

export function validateObjectId(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).send('Invalid ID Type');
    }

    next();
    
}