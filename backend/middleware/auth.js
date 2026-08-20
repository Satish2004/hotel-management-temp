import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token) return res.status(401).json({ message: "Not Authenticated!" });

    jwt.verify(token, process.env.JWT_SECRET || "secret_key", (err, user) => {
        if (err) return res.status(403).json({ message: "Token is not valid!" });
        req.user = user;
        next();
    });
};

export const verifyRole = (roles) => {
    return (req, res, next) => {
        verifyToken(req, res, () => {
            if (roles.includes(req.user.role)) {
                next();
            } else {
                return res.status(403).json({ message: "You are not authorized!" });
            }
        });
    };
};
