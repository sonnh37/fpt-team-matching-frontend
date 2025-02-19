export interface BaseEntity {
    id?: string;
    createdBy?: string;
    createdDate?: Date;
    updatedBy?: string;
    updatedDate?: Date;
    isDeleted: boolean;
    note?: string;
}

