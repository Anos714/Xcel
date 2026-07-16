class AppError extends Error {
public readonly statusCode:number;
public readonly status:"fail"|"error";
public readonly isOperational:boolean;



    constructor(message:string,statusCode:number){
        super(message);
        this.statusCode=statusCode

        this.status=statusCode>=500?"error":"fail";

        this.isOperational=true;

        Error.captureStackTrace(this,this.constructor)

    }
}

export default AppError