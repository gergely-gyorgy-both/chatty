import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChatRoom {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    username_one: string;

    @Column()
    username_two: string;
}
