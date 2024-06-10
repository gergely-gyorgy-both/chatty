import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { ChatRoom } from './chatroom.entity';

@Entity()
export class ChatMessage {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    username: string;

    @ManyToOne(() => ChatRoom, chatroom => chatroom, { nullable: true })
    @JoinColumn({ name: 'chatroom_id' })
    chatroom: ChatRoom;
}
