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

    async update(id, user) {
        return await userModel.findByIdAndUpdate(id, user, { new: true });
    }

    async delete(id) {
        return await userModel.findByIdAndDelete(id);
    }
}