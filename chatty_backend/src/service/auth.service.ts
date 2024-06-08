// authService.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }

    createAccessToken(username: string): Observable<string> {
        return from(this.jwtService.signAsync({ username }, { expiresIn: '1h' }));
    }

    createRefreshToken(username: string): Observable<string> {
        return from(this.jwtService.signAsync({ username }, { expiresIn: '7d' }));
    }
}
