import { BadRequestException, Body, Controller, Delete, Get, Logger, Param, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { catchError, forkJoin, from, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './service/auth.service';
import { UserLoginResponse } from './dto/UserLogin';
import { User } from './entity/user.entity';
import { Request } from 'express';
import { extractTokenFromHeader } from './util/util';
import { UserService } from './service/user.service';

@Controller()
export class AppController {
    constructor(private readonly userService: UserService, private jwtService: JwtService, private readonly authService: AuthService) { }

    @Get('user/login')
    isLoggedIn(@Param('username') username: string): boolean {
        return true;
    }

    @Get('user/check-username')
    doesUserExist(@Req() request: Request, @Query('username') username: string): Observable<boolean> {

        return from(this.userService.getUser(username)).pipe(
            map(user => Boolean(user) && username !== this.jwtService.decode<{ username }>(extractTokenFromHeader(request)).username)
        );
    }

    // @UseGuards(AuthGuard)
    @Post('user/login')
    login(@Body() request: { username: string }): Observable<UserLoginResponse> {

        const createUser$ = forkJoin([this.authService.createAccessToken(request.username), this.authService.createRefreshToken(request.username)]).pipe(
            mergeMap(([accessToken, refreshToken]) => from(this.userService.createUser(request.username, refreshToken)).pipe(
                map(() => [accessToken, refreshToken])
            )),
            map(([accessToken, refreshToken]) => ({ accessToken, refreshToken }))
        );

        return from(this.userService.getUser(request.username)).pipe(
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

        return from(this.userService.getUser(username)).pipe(
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
            tap(([_accessToken, refreshToken]) => this.userService.updateUserRefreshToken(username, refreshToken)),
            map(([accessToken, refreshToken]) => ({ accessToken, refreshToken }))
        )
    }

    @UseGuards(AuthGuard)
    @Delete('user/logout')
    logout(@Req() request: Request): Observable<void> {
        const username = this.jwtService.decode<{ username }>(extractTokenFromHeader(request)).username;

        return from(this.userService.deleteUser(username));
    }
}
