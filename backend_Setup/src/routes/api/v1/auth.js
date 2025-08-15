"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authController_1 = require("../../../controllers/auth/authController");
var router = (0, express_1.Router)();
// Public routes
router.post('/register', authController_1.authController.register.bind(authController_1.authController));
router.post('/login', authController_1.authController.login.bind(authController_1.authController));
exports.default = router;
