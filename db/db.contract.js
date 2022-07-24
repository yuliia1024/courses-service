const DB_CONTRACT = {
  common: {
    id: {
      property: 'id',
      column: 'id',
    },
    createdAt: {
      property: 'createdAt',
      column: 'created_at',
    },
    updatedAt: {
      property: 'updatedAt',
      column: 'updated_at',
    },
  },
  refreshToken: {
    tableName: 'refresh-token',
    npUserRefreshTokenReferenceName: 'np-user-refresh-token',
    userId: {
      property: 'userId',
      column: 'user_id',
    },
    expirationTime: {
      property: 'expirationTime',
      column: 'expiration_time',
    },
    refreshToken: {
      property: 'refreshToken',
      column: 'refresh_token',
    },
    accessToken: {
      property: 'accessToken',
      column: 'access_token',
    },
  },
  npUser: {
    tableName: 'np-user',
  },
};

module.exports = {
  DB_CONTRACT,
};
