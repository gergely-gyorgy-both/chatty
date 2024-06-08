import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class AppService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    public async createUser(username: string, refreshToken: string): Promise<User> {
        return this.usersRepository.save({ username, refreshToken });
    }

    public async updateUserRefreshToken(username: string, refreshToken: string): Promise<UpdateResult> {
        return this.usersRepository.update({ username }, { refreshToken });
    }

    public async getUser(username: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { username } })
    }

    public async deleteUser(username: string): Promise<void> {
        await this.usersRepository.delete({ username });
    }
}
