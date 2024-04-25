import {
	AllowNull,
	BeforeCreate,
	BelongsTo,
	Column,
	CreatedAt,
	DataType,
	ForeignKey,
	HasOne,
	IsDate,
	Model,
	Table,
	UpdatedAt,
} from 'sequelize-typescript'
import { Client } from './client.model'
import { Reparation } from './reparation.model'

export enum productState {
	PENDING = 'Pendiente',
	WAITING = 'En espera',
	REPAIRED = 'Reparado',
	DELIVERED = 'Entregado',
	RETURNED = 'Devuelto',
	CLOSED = 'Cerrado',
	PAID = 'Pagado',
}

@Table({
	timestamps: true,
	tableName: 'product', // nombre de la tabla en la base de datos
})
export class Product extends Model {
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
	})
	id!: string

	@Column({
		type: DataType.STRING,
	})
	product_name!: string

	@Column({
		type: DataType.STRING,
	})
	product_category!: string

	@Column({
		type: DataType.STRING,
	})
	brand!: string

	@Column({
		type: DataType.STRING,
	})
	model!: string

	@Column({
		type: DataType.STRING,
	})
	serial_number!: string

	@Column({
		type: DataType.STRING,
	})
	detail!: string

	@Column({
		type: DataType.STRING,
	})
	workshop!: string

	@Column({
		type: DataType.STRING,
	})
	issue_detail!: string

	@Column({
		type: DataType.STRING,
	})
	note!: string

	@Column({
		type: DataType.STRING,
	})
	diagnostic!: string

	@Column({
		type: DataType.ENUM(...Object.values(productState)),
		defaultValue: productState.PENDING,
	})
	state!: productState

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: false,
	})
	is_paid!: boolean

	@Column({
		type: DataType.DECIMAL(10, 2),
	})
	total_cost!: number

	@Column({
		type: DataType.DECIMAL(10, 2),
	})
	revision_cost!: number

	@Column({
		type: DataType.DECIMAL(10, 2),
	})
	reparation_cost!: number

	@Column({
		type: DataType.DATE,
	})
	warranty_date!: Date

	@Column({
		type: DataType.STRING,
	})
	warranty_invoice_number!: string

	@CreatedAt
	@Column
	entry_date!: Date

	@IsDate
	@Column
	exit_date!: Date

	@ForeignKey(() => Client)
	client_id!: Client

	@BelongsTo(() => Client)
	client!: Client

	@ForeignKey(() => Reparation)
	reparation_id!: string

	@BelongsTo(() => Reparation)
	reparation!: Reparation

	@AllowNull(true)
	@Column({
		type: DataType.STRING,
	})
	uriMercadoPago?: string

	@BeforeCreate
	static async capitalizeAttributes(instance: Product) {
		instance.brand = instance.brand.toUpperCase()
		instance.model = instance.model.toUpperCase()
		instance.serial_number = instance.serial_number.toUpperCase()
	}
}
