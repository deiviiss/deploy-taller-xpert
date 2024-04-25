import { AllowNull, BeforeCreate, BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasOne, IsEmail, Model, Table, Unique } from 'sequelize-typescript'
import { Client, Profile, Reparation, Workshop } from '.';

@Table({
	timestamps: false,
	tableName: 'user',
})
export class User extends Model<User> {
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
	})
	id!: string

	@AllowNull(false)
	@Column({
		type: DataType.STRING,
	})
	fullName!: string

	@AllowNull(false)
	@IsEmail
	@Unique(true)
	@Column({
		type: DataType.STRING,
	})
	email!: string

	@AllowNull(false)
	@Column({
		type: DataType.STRING,
	})
	password!: string

	@AllowNull(true)
	@Column({
		type: DataType.ENUM('admin', 'technician'),
		defaultValue: 'admin',
	})
	rol!: 'admin' | 'technician'

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: true,
		field: 'is_active', // Esto especifica el nombre del campo en la tabla de la base de datos
	})
	is_active!: boolean

	// Relacion con la tabla Profile, falta terminarlo
	@HasOne(() => Profile)
	profile!: Profile

	@HasOne(() => Workshop)
	workshop!: Workshop

	@HasOne(() => Reparation)
	reparation!: Reparation

	@BeforeCreate
    static async capitalizeAttributes(instance: User) {
        instance.email = instance.email.toLowerCase();
    }
}
