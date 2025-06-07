import { ModelStatic } from "sequelize";
import { BaseService } from "../base/BaseService";
import User from "../database/models/User";
import { CommSensoResponse } from "../utils/CommSensoResponse";
class UserService extends BaseService<User> {
	protected model: ModelStatic<User> = User;

	constructor() {
		super(User);
	}

	public async login(
		username: string,
		password: string
	): Promise<CommSensoResponse<User>> {
		const user = await this.model.findOne({
			where: {
				username,
			},
		});
		if (!user) {
			return new CommSensoResponse<User>({
				status: 404,
				message: "User not found",
				data: undefined,
			});
		}

		// Simplified password check - in production, use proper hashing
		if (password === user.password) {
			return new CommSensoResponse<User>({
				status: 200,
				message: "User found",
				data: user,
			});
		}

		return new CommSensoResponse<User>({
			status: 401,
			message: "Unauthorized",
			data: undefined,
		});
	}

	public async createUser(
		username: string,
		password: string
	): Promise<CommSensoResponse<User>> {
		const user = await this.model.findOne({
			where: {
				username,
			},
		});

		if (user) {
			return new CommSensoResponse<User>({
				status: 409,
				message: "User already exists",
				data: undefined,
			});
		}

		const newUser = await this.model.create({
			username,
			password, // In production, hash this password
		});

		return new CommSensoResponse<User>({
			status: 201,
			message: "User created",
			data: newUser,
		});
	}
}

export default UserService;
