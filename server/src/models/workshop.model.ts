import { AllowNull, BelongsTo, Column, DataType, ForeignKey, IsEmail, IsUrl, Model, Table, } from 'sequelize-typescript'
import { User } from './user.models'

export enum workshopCategory {
	Electricidad = 'Electricidad',
	Mecanica = 'Mecánica',
	Carpinteria = 'Carpintería',
	Plomeria = 'Plomería',
	Jardineria = 'Jardinería',
	Informatica = 'Informática',
	Telefonia = 'Telefonía',
	Electronica = 'Electrónica',
	Varios = 'Varios',
}

@Table({
	timestamps: false,
	tableName: 'workshop',
})
export class Workshop extends Model {
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		allowNull: false,
	})
	id!: string

	@AllowNull(false)
	@ForeignKey(() => User)
	@Column({ type: DataType.UUID })
	ownerId!: string

	@BelongsTo(() => User)
	owner!: User

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	name!: string

	@IsUrl
	@Column({
		type: DataType.STRING,
	})
	logoImage!: string

	@Column({
		type: DataType.STRING,
	})
	direction!: string

	@Column({
		type: DataType.STRING,
	})
	city!: string

	@Column({
		type: DataType.STRING,
	})
	phone!: string

	@Column({
		type: DataType.STRING,
	})
	cuit!: string

	@AllowNull(false)
	@Column({
		type: DataType.ENUM(...Object.values(workshopCategory)),
	})
	specializedField!: workshopCategory

	@AllowNull(false)
	@IsEmail
	@Column({
		type: DataType.STRING,
	})
	email!: string
}
