import { ModelStatic, UUID, UUIDV4 } from "sequelize";
import { BaseService } from "../base/BaseService";
import User from "../database/models/User";
import { CommSensoResponse } from "../utils/CommSensoResponse";
import { compareHash, generateHash } from "../utils/cripto";
import { v4 } from "uuid";
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
			return {
				status: 404,
				message: "User not found",
				data: undefined,
			};
		}

		if (compareHash(password, user.password)) {
			return {
				status: 200,
				message: "User found",
				data: user,
			};
		}

		return {
			status: 401,
			message: "Unauthorized",
			data: undefined,
		};
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
			return {
				status: 409,
				message: "User already exists",
				data: undefined,
			};
		}

		const hash = generateHash(password);

		const newUser = await this.model.create({
			id: v4(),
			username,
			password: hash,
		});

		return {
			status: 201,
			message: "User created",
			data: newUser,
		};
	}
}

export default UserService;
