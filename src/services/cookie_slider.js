"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CookieSlider = {
    middleware: (age) => {
        const cookieAge = age || 24 * 60 * 60 * 1000;
        return (req, res, next) => {
            const { session } = req.cookies;
            const sessionSig = req.cookies[`session.sig`];
            if (session && sessionSig) {
                res.cookie(`session`, session, { maxAge: cookieAge });
                res.cookie(`session.sig`, sessionSig, { maxAge: cookieAge });
            }
            if (next)
                next();
        };
    }
};
exports.default = CookieSlider;
//# sourceMappingURL=cookie_slider.js.map