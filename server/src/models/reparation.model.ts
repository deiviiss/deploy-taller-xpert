import { AllowNull, BeforeValidate, BelongsTo, Column, CreatedAt, DataType, ForeignKey, HasMany, HasOne, IsArray, IsDate, IsUUID, Model, Table, Unique, UpdatedAt } from "sequelize-typescript"
import { User } from "./user.models"
import { Client } from "./client.model"
import { Product } from "./product.model"
import { uuid } from "uuidv4"

export enum reparationState {
    OPENED = 'Abierto',
    CLOSED = 'Cerrado'
}

@Table({
    timestamps: true,
    tableName: 'reparation',
})
export class Reparation extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    id!: string

    @Column({
        type: DataType.STRING
    })
    ot_number!: string

    @Column({
        type: DataType.ENUM(...Object.values(reparationState)),
        defaultValue: reparationState.OPENED
    })
    state!: reparationState;

    @HasMany(() => Product)
    products!: Product[]

    @AllowNull(false)
    @ForeignKey(() => Client)
    @Column({ type: DataType.UUID })
    client_id!: string

    @CreatedAt
    @Column
    created_at!: Date;

    @UpdatedAt
    @Column
    updated_at!: Date;

    @BelongsTo(() => Client)
    client!: Client

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID })
    assigned_user!: string

    @BelongsTo(() => User)
    user!: User

    @BeforeValidate
    static async setCustomId(instance: Reparation) {
        if (!instance.ot_number) {
            instance.ot_number = await generateShortUUID();
        }
    }
}

// Define a function to generate the custom ID based on the count of records
async function generateCustomId(): Promise<string> {
    // Count the number of records in the model
    const count = await Reparation.count();

    // Increment the count by 1 to get the next available ID
    const nextId = count + 1;

    // Format the ID with leading zeros
    const formattedId = nextId.toString().padStart(8, '0');

    return formattedId;
}

async function generateShortUUID() {
    const fullUUID = uuid();
    const shortUUID = fullUUID.replace(/^(.{8}).*$/, '$1');
    return shortUUID;
}

