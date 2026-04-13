"use strict";
// ─── Enums ───────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterStatus = exports.GoalRole = exports.SystemRole = void 0;
var SystemRole;
(function (SystemRole) {
    SystemRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    SystemRole["USER"] = "USER";
})(SystemRole || (exports.SystemRole = SystemRole = {}));
var GoalRole;
(function (GoalRole) {
    GoalRole["ADMIN"] = "ADMIN";
    GoalRole["USER"] = "USER";
})(GoalRole || (exports.GoalRole = GoalRole = {}));
var ChapterStatus;
(function (ChapterStatus) {
    ChapterStatus["PENDING"] = "PENDING";
    ChapterStatus["COMPLETED"] = "COMPLETED";
})(ChapterStatus || (exports.ChapterStatus = ChapterStatus = {}));
