import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { v4 as uuid } from 'uuid';

import { Repository, UpdateResult } from 'typeorm';
import { ChatMessage } from 'src/entity/chat-message.entity';
import { ChatRoom } from 'src/entity/chatroom.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(ChatMessage)
        private chatRepository: Repository<ChatMessage>,
        @InjectRepository(ChatRoom)
        private chatRoomRepository: Repository<ChatRoom>,
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
        const newUsername = `deleted-user-${uuid()}`;

        await this.chatRepository.manager.query('SET FOREIGN_KEY_CHECKS=0');

        await this.chatRoomRepository
            .createQueryBuilder()
            .update(ChatRoom)
            .set({ user_one: { username: newUsername } })
            .where('user_one = :username', { username })
            .execute();
        await this.chatRoomRepository
            .createQueryBuilder()
            .update(ChatRoom)
            .set({ user_two: { username: newUsername } })
            .where('user_two = :username', { username })
            .execute();

        await this.chatRepository.update({ senderUser: { username } }, { senderUser: { username: newUsername } });
        await this.usersRepository.update({ username }, { username: newUsername, refreshToken: null });

        await this.chatRepository.manager.query('SET FOREIGN_KEY_CHECKS=0');
    }
}
