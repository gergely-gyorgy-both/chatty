import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable } from 'rxjs';
import { ChatRoomDto } from 'src/dto/ChatRoomDto';
import { MessageDto } from 'src/dto/Message';
import { ChatMessage } from 'src/entity/chat-message.entity';
import { ChatRoom } from 'src/entity/chatroom.entity';
import { User } from 'src/entity/user.entity';
import { IsNull, LessThan, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ChatService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(ChatMessage)
        private chatRepository: Repository<ChatMessage>,
        @InjectRepository(ChatRoom)
        private chatRoomRepository: Repository<ChatRoom>,
    ) { }

    public createChatRoom(username_one: string, username_two: string): Observable<ChatRoom> {
        return from(this.chatRoomRepository.save({ user_one: { username: username_one }, user_two: { username: username_two } }));
    }

    public getChatRoom(id: any): Observable<ChatRoom | null> {
        return from(this.chatRoomRepository.findOne({ where: { id } }));
    }

    public getNChatMessagesBeforeTimestamp(numberOfMessagesToRetrieve: number, timestamp: number, roomId?: string): Observable<ChatMessage[] | null> {
        return from(this.chatRepository.find({
            where: {
                chatroom: { id: (roomId ?? IsNull()) },
                dateMs: LessThan(timestamp)
            },
            take: numberOfMessagesToRetrieve,
            order: { dateMs: 'DESC' },
            relations: ['senderUser']
        })).pipe(
            map(result => result.map(entry => ({
                ...entry,
                dateMs: parseInt(entry.dateMs as any)
            })).reverse())
        );
    }

    public getChatRoomsForCurrentUser(username: string): Observable<ChatRoomDto[] | null> {
        return from(this.chatRoomRepository.find({
            where: [{ user_one: { username } }, { user_two: { username } }],
            relations: ['user_one', 'user_two']
        })).pipe(
            map(result => result.map(entry => ({
                ...entry,
                username_one: entry.user_one.username,
                username_two: entry.user_two.username
            })))
        );
    }

    public createMessage(message: MessageDto): Observable<ChatMessage> {
        return from(this.chatRepository.save(
            {
                senderUser: {
                    username: message.senderUsername ?? null
                },
                text: message.text,
                dateMs: message.dateMs,
                chatroom: {
                    id: message.roomId ?? null
                }
            }
        ));
    }
}
