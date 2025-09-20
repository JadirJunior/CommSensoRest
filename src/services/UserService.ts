import { ModelStatic, UUID, UUIDV4 } from "sequelize";
import { BaseService } from "../base/BaseService";
import User from "../database/models/User";
import { CommSensoResponse } from "../utils/CommSensoResponse";
import { compareHash, generateHash } from "../utils/cripto";
import { v4 } from "uuid";
import { createToken } from "../auth/auth";
import { LoginResponse } from "../utils/dto/types";
import App from "../database/models/App";

interface GetUserByIdResponse {
	id: string;
	username: string;
	apps: [{ id: string; name: string; slug: string }];
}

class UserService extends BaseService<User> {
	protected model: ModelStatic<User> = User;

	constructor() {
		super(User);
	}

	public async login(
		username: string,
		password: string
	): Promise<CommSensoResponse<LoginResponse>> {
		const user = await this.model.scope("withPassword").findOne({
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
			const { accessToken, refreshToken } = createToken(user);
			return {
				status: 200,
				message: "User found",
				data: {
					user: {
						id: user.id,
						username: user.username,
					},
					accessToken,
					refreshToken,
				},
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
	): Promise<CommSensoResponse<Omit<User, "password">>> {
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

		const { password: _pw, ...safe } = newUser.get({ plain: true });

		return {
			status: 201,
			message: "User created",
			data: safe, // sem password
		};
	}

	async getUserById(
		id: string
	): Promise<CommSensoResponse<GetUserByIdResponse>> {
		const result = await this.model.findByPk(id, {
			include: [
				{
					model: App,
					as: "apps",
					attributes: ["id", "name", "slug"],
				},
			],
		});

		if (!result) {
			throw new Error("Not found");
			// return new CommSensoResponse<M>({ status: 404, message: 'Not found' });
		}

		return new CommSensoResponse<GetUserByIdResponse>({
			data: result as unknown as GetUserByIdResponse,
			status: 200,
			message: "Listed with successful",
		});
	}
}

export default UserService;
