import jwtDecode from "jwt-decode";

export class JwtHelper {

  static decode(token:string): any {
    try {
      return jwtDecode(token)
    } catch (e) {
      return null
    }
  }

  static expiresAt = (token: string) => {
    if(!token) return 0;
    const decoded = this.decode(token)
    return decoded ? new Date(decoded.exp * 1000) : 0
  }

  static isValid = (token: string) => {
    return token && (new Date().getTime() < <number>this.expiresAt(token));
  }
}