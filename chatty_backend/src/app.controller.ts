import { BadRequestException, Body, Controller, Delete, Get, Logger, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { catchError, forkJoin, from, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './service/auth.service';
import { UserLoginResponse } from './dto/user-login';
import { User } from './entity/user.entity';
import { Request } from 'express';
import { extractTokenFromHeader } from './util/util';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService, private jwtService: JwtService, private readonly authService: AuthService) { }

    @Get('user/login')
    isLoggedIn(@Param('username') username: string): boolean {
        return true;
    }

    // @UseGuards(AuthGuard)
    @Post('user/login')
    login(@Body() request: { username: string }): Observable<UserLoginResponse> {

        const createUser$ = forkJoin([this.authService.createAccessToken(request.username), this.authService.createRefreshToken(request.username)]).pipe(
            mergeMap(([accessToken, refreshToken]) => from(this.appService.createUser(request.username, refreshToken)).pipe(
                map(() => [accessToken, refreshToken])
            )),
            tap((access_token) => Logger.log(access_token)),
            map(([accessToken, refreshToken]) => ({ accessToken, refreshToken }))
        );

        return from(this.appService.getUser(request.username)).pipe(
            tap(user => {
                if (user) {
                    throw new BadRequestException('Username already taken');
                }
            }),
            switchMap(() => createUser$)
        );
    }

    @Post('user/refresh')
    refreshToken(@Body() request: { refreshToken: string }): Observable<UserLoginResponse> {
        const username = this.jwtService.decode<{ username }>(request.refreshToken).username;
        Logger.log(username);

        return from(this.appService.getUser(username)).pipe(
            tap(user => {
                if (user.refreshToken !== request.refreshToken) {
                    throw new UnauthorizedException('Invalid refresh token');
                }
            }),
            switchMap(() => from(forkJoin(
                [
                    this.authService.createAccessToken(username),
                    this.authService.createRefreshToken(username)
                ]
            ))),
            tap(([_accessToken, refreshToken]) => this.appService.updateUserRefreshToken(username, refreshToken)),
            map(([accessToken, refreshToken]) => ({ accessToken, refreshToken }))
        )
    }

    @UseGuards(AuthGuard)
    @Delete('user/logout')
    logout(@Req() request: Request): Observable<void> {
        const username = this.jwtService.decode<{ username }>(extractTokenFromHeader(request)).username;
        Logger.log(username);

        return from(this.appService.deleteUser(username));
    }
}
