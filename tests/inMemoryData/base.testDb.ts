import mongoose, { Model, Schema } from 'mongoose';

/**
 * Data generation for tests
 */
export class BaseInMemoryData<MI extends Model<any, any>> {
    protected readonly repositoryModel: MI;

    /**
     * A model based on the given schema. Repository object that abstracts and simplifies database calls.
     */
    constructor(modelName: string, modelSchema: Schema) {
        this.repositoryModel = mongoose.model(modelName, modelSchema) as MI;
    }

    public newPersistant<T>(dataModelObject: T): Promise<T> {
        return this.repositoryModel.create(dataModelObject);
    }
}
