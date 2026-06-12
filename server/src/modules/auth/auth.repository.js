import userModel from "../../model/user.model.js";

export default class AuthRepository {
    async findByEmail(email) {
        return await userModel.findOne({ email });
    }

    async findById(id) {
        return await userModel.findById(id);
    }

    async create(userData) {
        return await userModel.create(userData);
    }

    async update(id, userData) {
        return await userModel.findByIdAndUpdate(id, userData, { new: true });
    }
}
