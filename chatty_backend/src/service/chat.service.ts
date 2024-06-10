import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { ChatRoom } from 'src/entity/chatroom.entity';
import { User } from 'src/entity/user.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ChatService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(ChatRoom)
        private chatRoomRepository: Repository<ChatRoom>,
    ) { }

    public createChatRoom(username_one: string, username_two: string): Observable<ChatRoom> {
        return from(this.chatRoomRepository.save({ username_one, username_two }));
    }

    public getChatRoom(id: any): Observable<ChatRoom | null> {
        return from(this.chatRoomRepository.findOne({ where: { id } }));
    }

    public getChatRoomForCurrentUser(username: string): Observable<ChatRoom[] | null> {
        return from(this.chatRoomRepository.find({ where: [{ username_one: username }, { username_two: username }] }));
    }
}
