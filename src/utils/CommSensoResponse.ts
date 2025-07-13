export type Data<TObject> = TObject;

export class CommSensoResponse<TObject> {
	message?: string;

	data?: Data<TObject>;

	total?: number;

	status?: number;

	constructor(props?: {
		data?: Data<TObject>;
		message?: string;
		status?: number;
		total?: number;
	}) {
		this.data = props?.data;
		this.message = props?.message;
		this.status = props?.status;
		this.total = props?.total;
	}
}
