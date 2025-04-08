// models/BaseModel.ts
export abstract class BaseModel {
    id: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<BaseModel>) {
        this.id = data.id || '';
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    toJSON() {
        return { ...this }
    }
}