import userModel from "../model/user.model.js";

export default class UserRepository {

    async findByEmail(email) {
        return await userModel.findOne({ email });
    }

    async findById(id) {
        return await userModel.findById(id);
    }

    async create(user) {
        return await userModel.create(user);
    }

    async update(id, updateData) {
        return await userModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await userModel.findByIdAndDelete(id);
    }

    async findAll(filter = {}, options = {}) {
        const { skip = 0, limit = 10, select = '' } = options;
        return await userModel
            .find(filter)
            .select(select)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
    }

    async countAll(filter = {}) {
        return await userModel.countDocuments(filter);
    }

    async softDelete(id) {
        return await userModel.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );
    }
}