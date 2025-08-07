// middlewares/verifyToken.ts
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

export const verifyToken = (token: string): DecodedToken => {
  if (!token) {
    throw new Error('Token no enviado');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    return decoded as DecodedToken;
  } catch (error) {
    throw new Error('Token inválido');
  }
};
