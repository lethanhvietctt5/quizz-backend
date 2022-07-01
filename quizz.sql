SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user
-- ----------------------------

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
	`user_id` VARCHAR(100) NOT NULL,
    `email` VARCHAR(50) NOT NULL UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `password` VARCHAR(1000) NOT NULL,
    `rf_token` VARCHAR(200),
    PRIMARY KEY (`user_id`)
);

-- ----------------------------
-- Table structure for game
-- ----------------------------
DROP TABLE IF EXISTS `game`;
CREATE TABLE `game` (
	`game_id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `author_id` VARCHAR(100) NOT NULL,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`game_id`),
    CONSTRAINT `fk_game_user` FOREIGN KEY (`author_id`) REFERENCES `user` (`user_id`)
);

-- ----------------------------
-- Table structure for question
-- ----------------------------
DROP TABLE IF EXISTS `question`;
CREATE TABLE `question` (
	`question_id` VARCHAR(100) NOT NULL,
    `game_id` VARCHAR(100) NOT NULL,
    `content` VARCHAR(300) NOT NULL,
    `ans_A` VARCHAR(100) NOT NULL,
    `ans_B` VARCHAR(100) NOT NULL,
    `ans_C` VARCHAR(100) NOT NULL,
    `ans_D` VARCHAR(100) NOT NULL,
	`correct_ans` VARCHAR(4) NOT NULL,
    `duration_sec` INT NOT NULL DEFAULT 10,
    PRIMARY KEY (`question_id`),
    CONSTRAINT `fk_question_game` FOREIGN KEY (`game_id`) REFERENCES `game` (`game_id`)
);

-- ----------------------------
-- Table structure for report
-- ----------------------------
DROP TABLE IF EXISTS `report`;
CREATE TABLE `report` (
	`report_id` VARCHAR(100) NOT NULL,
    `game_id` VARCHAR(100) NOT NULL,
    `pin_code` VARCHAR(6) NOT NULL,
    `status` INTEGER DEFAULT 0,
    `started_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`report_id`),
    CONSTRAINT `fk_report_game` FOREIGN KEY (`game_id`) REFERENCES `game` (`game_id`)
);

-- ----------------------------
-- Table structure for player
-- ----------------------------
DROP TABLE IF EXISTS `player`;
CREATE TABLE `player` (
	`player_id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
	`report_id` VARCHAR(100) NOT NULL,
    `correct_count` INT NOT NULL DEFAULT 0,
    `score` INT NOT NULL DEFAULT 0
)


-- ----------------------------
-- Table structure for parameter
-- ----------------------------
DROP TABLE IF EXISTS `parameter`;
CREATE TABLE `parameter` (
	`key` VARCHAR(100) NOT NULL,
    `value` VARCHAR(100) NOT NULL
)
INSERT INTO `parameter`
VALUES ("last_pin", "100000");


