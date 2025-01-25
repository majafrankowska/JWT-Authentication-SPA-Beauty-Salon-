const userRepository = require("../repositories/UserRepository");
const sessionRepository = require("../repositories/SessionRepository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const {
  ValidationError,
  ConflictError,
  NotFoundError,
} = require("../errors/CustomError");

const UserDto = require("../dtos/UserDto");

class AuthService {
  static async register(username, email, password, role) {
    if (!username || !email || !password || !role) {
      throw new ValidationError("registerError.missingFields");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError("registerError.invalidEmail");
    }

    if (password.length < 6) {
      throw new ValidationError("registerError.passwordTooShort");
    }

    if (username.length < 5) {
      throw new ValidationError("registerError.usernameTooShort");
    }

    const existingUser = await userRepository.getUserByUsernameOrEmail(username);
    if (existingUser) {
      throw new ConflictError("registerError.usernameTaken");
    }

    const existingEmail = await userRepository.getUserByEmail(email);
    if (existingEmail) {
      throw new ConflictError("registerError.emailTaken");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create(username, email, hashedPassword, role);

    if (role === 'client') {
      await userRepository.createClient(user.id);
    } else if (role === 'employee') {
      await userRepository.createEmployee(user.id, email);
    }

    return new UserDto(user, role);
  }

  static async login(identifier, password) {
    if (!identifier || !password) {
      throw new ValidationError("loginError.missingFields");
    }

    const user = await userRepository.getUserByUsernameOrEmail(identifier);
    if (!user) {
      throw new NotFoundError("loginError.userNotFound");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ValidationError("loginError.invalidCredentials");
    }

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    const accessTokenExpiration = moment()
      .utc()
      .add(parseInt(process.env.ACCESS_TOKEN_EXPIRATION), "seconds")
      .toDate("YYYY-MM-DD HH:mm:ss");

    const refreshTokenExpiration = moment()
      .utc()
      .add(parseInt(process.env.REFRESH_TOKEN_EXPIRATION), "seconds")
      .toDate("YYYY-MM-DD HH:mm:ss");

    await sessionRepository.createSession(user.id, accessToken, refreshToken, accessTokenExpiration, refreshTokenExpiration);

    return {
      user: new UserDto(user, user.role),
      accessToken,
      refreshToken,
    };
  }

  static async logout(identifier, refreshToken) {
    if (!identifier || !refreshToken) {
      throw new ValidationError("logoutError.missingFields");
    }

    const user = await userRepository.getUserByUsernameOrEmail(identifier);
    if (!user) {
      throw new NotFoundError("logoutError.userNotFound");
    }

    const session = await sessionRepository.getSessionByUserIdAndRefreshToken(user.id, refreshToken);
    if (!session) {
      throw new NotFoundError("logoutError.sessionNotFound");
    }

    await sessionRepository.deleteSession(user.id, refreshToken);
    return { message: "Logout successful" };
  }

  static async generateTokens(userId) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is not set");
    }

    const payload = { userId };

    console.log("Generating tokens with payload:", payload);

    const accessToken = jwt.sign(payload, secret, {
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRATION) || 3600,  
    });

    const refreshToken = jwt.sign(payload, secret, {
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRATION) || 86400,  
    });

    console.log("Generated Access Token:", accessToken);
    console.log("Generated Refresh Token:", refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(username, refreshToken) {
    try {
      jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (err) {
      throw new ValidationError("Refresh token is invalid.");
    }

    const user = await userRepository.getUserByUsername(username);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const session = await sessionRepository.getSessionByUserIdAndRefreshToken(user.id, refreshToken);
    if (!session || moment.utc(session.refresh_token_expires_at).isBefore(moment.utc())) {
      throw new ValidationError("Refresh token has expired or is invalid.");
    }

    const newTokens = await this.generateTokens(user.id);

    const newAccessTokenExpiration = moment()
      .utc()
      .add(parseInt(process.env.ACCESS_TOKEN_EXPIRATION), "seconds")
      .format("YYYY-MM-DD HH:mm:ss");

    await sessionRepository.refreshAccessToken(
      user.id,
      newTokens.accessToken,
      refreshToken,
      newAccessTokenExpiration
    );

    return {
      accessToken: newTokens.accessToken,
    };
  }
}

module.exports = AuthService;