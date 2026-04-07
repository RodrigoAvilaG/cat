import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';

@Entity('stores') // Esto le dice a Postgres que la tabla se llamará "stores"
export class Store {
  @PrimaryGeneratedColumn('uuid') // Usaremos UUIDs como IDs para mayor seguridad en las URLs
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', unique: true }) // El slug DEBE ser único a nivel de Base de Datos
  slug!: string;

  @Column({ name: 'whatsapp_number', type: 'varchar', length: 20 })
  whatsappNumber!: string;

  @Column({ type: 'jsonb', nullable: true }) // 🔥 El poder de Postgres para los atributos dinámicos
  config!: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' }) // TypeORM manejará las fechas automáticamente
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}