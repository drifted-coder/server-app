exports.logout = async (userId, refreshToken) => {
  await User.updateOne(
    { _id: userId },
    {
      $pull: {
        refreshTokens: {
          token: refreshToken,
        },
      },
    },
  );
};