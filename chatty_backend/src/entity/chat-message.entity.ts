import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { ChatRoom } from './chatroom.entity';
import { User } from './user.entity';

@Entity()
export class ChatMessage {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'username' })
    senderUser?: User;

    @Column()
    text: string;

    @Column({ type: 'bigint' })
    dateMs: number;

    @ManyToOne(() => ChatRoom, { nullable: true })
    @JoinColumn({ name: 'chatroom_id' })
    chatroom?: ChatRoom;
}
