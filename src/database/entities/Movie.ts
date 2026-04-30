import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { MovieRating } from "../../config/constants";
import { Showtime } from "./Showtime";

@Entity("movies")
export class Movie {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "varchar", length: 100 })
  genre!: string;

  @Column({ type: "varchar", length: 50 })
  language!: string;

  @Column({ type: "int" })
  durationMinutes!: number;

  @Column({ type: "varchar", length: 10 })
  rating!: MovieRating;

  @Column({ type: "timestamptz" })
  releaseDate: Date;

  @Column({ type: "varchar", length: 500, nullable: true })
  posterUrl!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @OneToMany(() => Showtime, showtime => showtime.movie)
  showtimes!: Showtime[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deletedAt!: Date;
}
