/*
 Navicat Premium Data Transfer

 Source Server         : 23.225.168.190
 Source Server Type    : MySQL
 Source Server Version : 50648
 Source Host           : 23.225.168.190:3306
 Source Schema         : longwen

 Target Server Type    : MySQL
 Target Server Version : 50648
 File Encoding         : 65001

 Date: 16/10/2020 16:51:06
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for paylog
-- ----------------------------
DROP TABLE IF EXISTS `paylog`;
CREATE TABLE `paylog`  (
  `pay_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `role_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT '角色ID',
  `order_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '' COMMENT '订单号',
  `title` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT '标题',
  `description` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT '描述',
  `num` int(11) NULL DEFAULT 0 COMMENT '数量',
  `get_first_pay` int(11) NULL DEFAULT NULL COMMENT '首充奖励领取',
  `create_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  PRIMARY KEY (`pay_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 237 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci COMMENT = '首充奖励是否领取：1已领取  0未领取' ROW_FORMAT = Compact;

SET FOREIGN_KEY_CHECKS = 1;
