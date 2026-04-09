import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 🔥 1. REGISTRAR AL ADMINISTRADOR
  async register(authDto: AuthDto) {
    const { email, password } = authDto;

    // Checamos si ya existe alguien con ese correo
    const userExists = await this.userRepository.findOneBy({ email });
    if (userExists) {
      throw new BadRequestException('Ese correo ya está registrado.');
    }

    // 🕵️‍♂️ Encriptamos la contraseña (el '10' es el nivel de sal, lo estándar y seguro)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardamos en la base de datos
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    return { message: 'Usuario administrador creado con éxito.' };
  }

  // 🔥 2. INICIAR SESIÓN Y DAR EL TOKEN
  async login(authDto: AuthDto) {
    const { email, password } = authDto;

    // Buscamos al usuario
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Comparamos la contraseña de texto plano con el Hash de la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Si todo está bien, le armamos su pulsera VIP (JWT)
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { 
      message: 'Login exitoso',
      token 
    };
  }
}