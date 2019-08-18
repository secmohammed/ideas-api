import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      return false;
    }
    request.user = await this.validateToken(request.headers.authorization);
    return true;
  }
  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException(
        'Invalid Token has been passed',
        HttpStatus.FORBIDDEN,
      );
    }
    const token = auth.split(' ')[1];
    try {
      const decodedToken = await verify(
        token,
        process.env.SECRET_TOKEN || 'blabla',
      );
      return decodedToken;
    } catch (err) {
      const message = 'Token error:' + err.message;
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
