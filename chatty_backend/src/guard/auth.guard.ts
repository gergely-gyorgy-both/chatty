import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWTSecret } from 'src/constants';
import { AuthService } from 'src/service/auth.service';
import { extractTokenFromHeader } from 'src/util/util';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = extractTokenFromHeader(request);
        if (!token) {
            return false;
        }
        try {
            const payload = await this.authService.verifyToken(
                token
            ).toPromise();
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = payload.username;
            console.log(request['user']);
        } catch {
            return false;
        }
        return true;
    }


}
