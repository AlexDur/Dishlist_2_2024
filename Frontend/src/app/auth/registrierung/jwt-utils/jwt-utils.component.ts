import {jwtDecode} from 'jwt-decode';

export class JwtUtils {
  static isTokenValid(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp > currentTime; // Prüfen, ob das Token noch gültig ist
    } catch (error) {
      console.error('Fehler bei der JWT-Dekodierung:', error);
      return false;
    }
  }
}
