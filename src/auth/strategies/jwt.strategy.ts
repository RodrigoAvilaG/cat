import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, 
      // 🔥 LA MAGIA ESTÁ AQUÍ: Agregamos el "!" al final
      secretOrKey: configService.get<string>('JWT_SECRET')!, 
    });
  }

  // Si el token es válido, este método se ejecuta y nos devuelve los datos del usuario
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}