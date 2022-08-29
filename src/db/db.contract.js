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
    createdBy: {
      property: 'createdBy',
      column: 'created_by',
    },
    updatedBy: {
      property: 'updatedBy',
      column: 'updated_by',
    },
  },
  refreshToken: {
    tableName: 'refresh-token',
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
  adminUser: {
    tableName: 'admin-user',
    firstName: {
      property: 'firstName',
      column: 'first_name',
    },
    lastName: {
      property: 'lastName',
      column: 'last_name',
    },
    email: {
      property: 'email',
      column: 'email',
    },
    role: {
      property: 'role',
      column: 'role',
    },
    isActive: {
      property: 'isActive',
      column: 'is_active',
    },
    hashPassword: {
      property: 'hashPassword',
      column: 'hash_password',
    },
  },
  studentUser: {
    tableName: 'student-user',
    firstName: {
      property: 'firstName',
      column: 'first_name',
    },
    lastName: {
      property: 'lastName',
      column: 'last_name',
    },
    email: {
      property: 'email',
      column: 'email',
    },
    phone: {
      property: 'phone',
      column: 'phone',
    },
    role: {
      property: 'role',
      column: 'role',
    },
    isActive: {
      property: 'isActive',
      column: 'is_active',
    },
    isVerified: {
      property: 'isVerified',
      column: 'is_verified',
    },
    hashPassword: {
      property: 'hashPassword',
      column: 'hash_password',
    },
  },
  instructorUser: {
    tableName: 'instructor-user',
    firstName: {
      property: 'firstName',
      column: 'first_name',
    },
    lastName: {
      property: 'lastName',
      column: 'last_name',
    },
    email: {
      property: 'email',
      column: 'email',
    },
    role: {
      property: 'role',
      column: 'role',
    },
    isActive: {
      property: 'isActive',
      column: 'is_active',
    },
    isVerified: {
      property: 'isVerified',
      column: 'is_verified',
    },
    hashPassword: {
      property: 'hashPassword',
      column: 'hash_password',
    },
    generalInformation: {
      property: 'generalInformation',
      column: 'general_information',
    },
    academicStatus: {
      property: 'academicStatus',
      column: 'academic_status',
    },
  },
};

module.exports = {
  DB_CONTRACT,
};
