import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn()
    username: string;

    @Column({ nullable: true })
    refreshToken: string;
}
