const db = require("../config/db");

class SessionRepository {
  
  
  static async createSession(userId, accessToken, refreshToken, accessTokenExpiration, refreshTokenExpiration) {
    const [existingSession] = await db.query(
      "SELECT * FROM sessions WHERE user_id = ?",
      [userId]
    );

    if (existingSession.length > 0) {
      await db.query(
        `UPDATE sessions 
             SET token = ?, refresh_token = ?, token_expires_at = ?, refresh_token_expires_at = ? 
             WHERE user_id = ?`,
        [accessToken, refreshToken, accessTokenExpiration, refreshTokenExpiration, userId]
      );
    } else {
      await db.query(
        "INSERT INTO sessions (user_id, token, refresh_token, token_expires_at, refresh_token_expires_at) VALUES (?, ?, ?, ?, ?)",
        [userId, accessToken, refreshToken, accessTokenExpiration, refreshTokenExpiration]
      );
    }
  }

  static async getSessionByToken(token) {
    console.log("Searching session with access token:", token);
    const [rows] = await db.query(
      "SELECT * FROM sessions WHERE token = ?",
      [token]
    );
    console.log("Query result for session:", rows);
    return rows.length ? rows[0] : null;
  }

  static async getSessionByUserIdAndRefreshToken(userId, refreshToken) {
    console.log("Searching session for userId:", userId, "with refreshToken:", refreshToken);
    const [rows] = await db.query(
      "SELECT * FROM sessions WHERE user_id = ? AND refresh_token = ?",
      [userId, refreshToken]
    );
    console.log("Query result for session:", rows);
    return rows[0];
  }

  static async refreshAccessToken(
    userId,
    newToken,
    refreshToken,
    newAccessTokenExpiration
  ) {
    await db.query(
      "UPDATE sessions SET token = ?, token_expires_at = ? WHERE user_id = ? AND refresh_token = ?",
      [newToken, newAccessTokenExpiration, userId, refreshToken]
    );

    return newToken;
  }

  static async deleteSession(userId, refreshToken) {
    console.log("Attempting to delete session for userId:", userId, "and refreshToken:", refreshToken);
    const [result] = await db.query(
      "DELETE FROM sessions WHERE user_id = ? AND refresh_token = ?",
      [userId, refreshToken]
    );
    console.log("Delete query result:", result);
    if (result.affectedRows === 0) {
      console.log("No session found to delete.");
      return false; 
    }
    console.log("Session deleted successfully.");
    return true; 
  }

  static async deleteAllSessionsByUserId(userId) {
    await db.query("DELETE FROM sessions WHERE user_id = ?", [userId]);
  }
}

module.exports = SessionRepository;
