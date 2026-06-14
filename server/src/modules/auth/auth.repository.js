import userModel from "../../model/user.model.js";

export default class AuthRepository {
    async findByEmail(email) {
        return await userModel.findOne({ email }).lean();
    }

    async findById(id) {
        return await userModel.findById(id).lean();
    }

    async create(userData) {
        return await userModel.create(userData);
    }

    async update(id, userData) {
        return await userModel.findByIdAndUpdate(id, userData, { new: true });
    }

    async updateRefreshToken(userId, hashedToken) {
        return await userModel.findByIdAndUpdate(userId, { refreshToken: hashedToken }, { new: true });
    }

    async clearRefreshToken(userId) {
        return await userModel.findByIdAndUpdate(userId, { refreshToken: null }, { new: true });
    }
}
