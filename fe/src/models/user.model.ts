import {BaseModel} from "@/models/base.model";
import {UserEntity} from "@/types/user.entity";

export default class UserModel extends BaseModel implements UserEntity {
    email: string;
    name: string;
    role: string;

    constructor(data: Partial<UserModel>) {
        super(data);
        this.email = data.email || '';
        this.name = data.name || '';
        this.role = data.role || '';
    }
}