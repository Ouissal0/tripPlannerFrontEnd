class User {
 
    constructor(data = {}) {
      this.username = data.userName || '';
      this.password = data.password || '';
      this.firstName = data.firstName || '';
      this.lastName = data.lastName || '';
      this.email = data.email || '';
      this.picture = data.profileImage || null;
      this.phoneNumber = data.phoneNumber || '';
      this.role = data.role || 'CLIENT';
      this.createdAt = data.createdAt || new Date();
    }
  

  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  toJSON() {
    return {
      username: this.username,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      picture: this.picture,
      phoneNumber: this.phoneNumber,
      role: this.role,
       };
  }
}

export default User;
