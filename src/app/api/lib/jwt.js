import jwt from "jsonwebtoken";

export function generateToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    username: user.name,
    bio: user.bio
  };

  const token = jwt.sign(payload, process.env.JWTKEY, {
    expiresIn: "3d",
  });

  return token;
}
export function verifyToken(token) {
  try {
    const data = jwt.verify(token, process.env.JWTKEY);
      return data;
  } catch (err) {
    return null;
  }
} 