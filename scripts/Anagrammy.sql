CREATE TABLE "user" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "username" varchar(255) NOT NULL,
  "email" varchar(255) UNIQUE NOT NULL,
  "phone" varchar(255) UNIQUE,
  "password" text NOT NULL,
  "is_email_verified" boolean DEFAULT false,
  "is_phone_verified" boolean DEFAULT false,
  "is_verified" boolean DEFAULT false,
  "last_login" timestamp,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "is_deleted" boolean DEFAULT false,
  "deleted_at" timestamp
);

CREATE TABLE "player" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "socket_client_id" varchar(255),
  "username" varchar(255),
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "is_deleted" boolean DEFAULT false,
  "deleted_at" timestamp
);

CREATE TABLE "word" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "word" text NOT NULL,
  "word_length" int NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "is_deleted" boolean DEFAULT false,
  "deleted_at" timestamp
);

CREATE TABLE "game" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "player_id" uuid NOT NULL,
  "total_levels" int NOT NULL DEFAULT 5,
  "current_level" int NOT NULL DEFAULT 0,
  "correct_count" int NOT NULL DEFAULT 0,
  "fail_count" int NOT NULL DEFAULT 0,
  "started_at" timestamp,
  "finished_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "is_deleted" boolean DEFAULT false,
  "deleted_at" timestamp
);

CREATE TABLE "question" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "game_id" uuid NOT NULL,
  "word_id" uuid NOT NULL,
  "level" int NOT NULL,
  "answer" text,
  "is_answer_no_anagram" boolean,
  "is_correct" boolean,
  "points" int NOT NULL DEFAULT 0,
  "asked_at" timestamp NOT NULL,
  "answered_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "is_deleted" boolean DEFAULT false,
  "deleted_at" timestamp
);

ALTER TABLE "game" ADD FOREIGN KEY ("player_id") REFERENCES "player" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "question" ADD FOREIGN KEY ("game_id") REFERENCES "game" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "question" ADD FOREIGN KEY ("word_id") REFERENCES "word" ("id") ON UPDATE CASCADE;
