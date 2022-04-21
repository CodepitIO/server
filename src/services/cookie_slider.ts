const CookieSlider = {
  middleware: (age?: number) => {
    const cookieAge = age || 24 * 60 * 60 * 1000;
    return (req: { cookies: { [x: string]: any; }; }, res: { cookie: (arg0: string, arg1: any, arg2: { maxAge: any; }) => void; }, next: () => void) => {
      const { session } = req.cookies;
      const sessionSig = req.cookies[`session.sig`];
      if (session && sessionSig) {
        res.cookie(`session`, session, { maxAge: cookieAge });
        res.cookie(`session.sig`, sessionSig, { maxAge: cookieAge });
      }
      if (next) next();
    };
  }
}

export default CookieSlider;