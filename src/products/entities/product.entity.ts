import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Store } from '../../stores/entities/store.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  // Usamos 'decimal' para precios, NUNCA uses 'float' para dinero o perderás centavos por redondeos de CPU
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'int', default: 0 })
  stock!: number; // Regla de negocio: Si llega a 0, lo ocultaremos en el frontend

  @Column({ type: 'simple-array', nullable: true })
  images!: string[]; // TypeORM guardará esto como un string separado por comas: "img1.png,img2.png"

  @Column({ type: 'simple-array', nullable: true })
  tags!: string[]; // Para tus proyecciones y estadísticas

  // 🔥 Nuestro JSONB para los "Extras"
  @Column({ type: 'jsonb', nullable: true })
  extras: any;

  // RELACIÓN: Muchos Productos pertenecen a Una Tienda
  @ManyToOne(() => Store, (store) => store.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' }) // Esto crea la columna física en Postgres
  store!: Store;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}