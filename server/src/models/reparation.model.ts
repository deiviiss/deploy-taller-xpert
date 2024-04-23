import { AllowNull, BeforeValidate, BelongsTo, Column, CreatedAt, DataType, ForeignKey, HasMany, HasOne, IsArray, IsDate, IsUUID, Model, Table, Unique, UpdatedAt } from "sequelize-typescript"
import { User } from "./user.models"
import { Client } from "./client.model"
import { Product } from "./product.model"

export enum reparationState {
    PENDING = 'Pendiente',
    IN_PROGRESS = 'En Progreso',
    REPAIRED = 'Reparado',
    DONE = 'Finalizado'
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

    @Unique(true)
    @Column({
        type: DataType.STRING
    })
    ot_number!: string

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
            instance.ot_number = await generateCustomId();
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
