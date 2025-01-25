class UserDto {
  constructor(user, role, appointments) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.role = role;
    this.appointments = appointments; 
    this.createdAt = user.created_at; 
  }
}

module.exports = UserDto;
