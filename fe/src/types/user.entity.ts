import {BaseEntity} from './base.entity';

interface UserEntity extends BaseEntity {
    email: string;
    name: string;
    role: string;
}

export type {
    UserEntity,
}