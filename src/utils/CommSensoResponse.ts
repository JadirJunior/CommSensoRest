


export type Data<TObject> = TObject;

export class CommSensoResponse<TObject> {

    message?: string

    data ?: Data<TObject>
    
    status ?: number


    constructor(props ?: { data ?: Data<TObject>, message ?: string, status ?: number }) {
        this.data = props?.data
        this.message = props?.message
        this.status = props?.status
    }
}