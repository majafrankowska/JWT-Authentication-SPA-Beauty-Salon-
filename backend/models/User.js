class User {
  constructor(id, username, email, password, role, createdAt, updatedAt) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role; 
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = User;
