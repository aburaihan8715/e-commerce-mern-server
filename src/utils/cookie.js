const setAccessTokenCookie = (res, accessToken) => {
  // set token in the cookie
  res.cookie('accessToken', accessToken, {
    maxAge: 5 * 60 * 1000, // 5 minutes
    httpOnly: true,
    // FIXME: when send req from browser means not from post man then uncomment the secure option
    // secure: true,
    sameSite: 'none',
  });
};
const setRefreshTokenCookie = (res, refreshToken) => {
  // set token in the cookie
  res.cookie('refreshToken', refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    // FIXME: when send req from browser means not from post man then uncomment the secure option
    // secure: true,
    sameSite: 'none',
  });
};

export { setAccessTokenCookie, setRefreshTokenCookie };
