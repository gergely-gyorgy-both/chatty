import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ChatRoom {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'username_one' })
    user_one: User;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'username_two' })
    user_two: User;
}
