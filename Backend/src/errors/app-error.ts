export class AppError extends Error {
    public readonly statusCode: number;

    public readonly code?: string;

    constructor(message: string, code?: string, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}
