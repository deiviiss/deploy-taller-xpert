import { AllowNull, BelongsTo, Column, DataType, ForeignKey, HasMany, IsAlpha, IsUrl, Model, Table } from 'sequelize-typescript'
import { User } from '.'

@Table({
	timestamps: false,
	tableName: 'profile',
})
export class Profile extends Model {
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
	})
	id!: string

	@AllowNull(false)
	@ForeignKey(() => User)
	@Column({ type: DataType.UUID })
	userId!: string

	@BelongsTo(() => User)
	user!: User

	@AllowNull(false)
	@Column({
		type: DataType.STRING,
	})
	fullName!: string

	@Column({
		type: DataType.STRING(20),
	})
	phone!: string

	@Column({
		type: DataType.STRING(50),
	})
	address!: string

	@IsUrl
	@Column({
		type: DataType.STRING,
	})
	photo_url!: string
}
