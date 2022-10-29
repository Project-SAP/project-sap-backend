import mongoose, { Schema } from 'mongoose';

export class BaseRepository<MI = 'Model Type'> {
    protected readonly repositoryModel: MI;

    /**
     * A model based on the given schema. Repository object that abstracts and simplifies database calls.
     */
    constructor(modelName: string, modelSchema: Schema) {
        this.repositoryModel = mongoose.model(modelName, modelSchema) as MI;
    }
}
