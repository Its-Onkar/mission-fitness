import { verifyToken } from "../utils/auth.utils.js";
import User from "../Schema/user.schema.js";

export const authenticateToken = async (req, res, next) => {
    try {
        // For browser navigation, render a page that checks localStorage/sessionStorage
        if (!req.headers.authorization && !req.query?.token && !req.cookies?.token) {
            return res.send(`
                <!DOCTYPE html>
                <html>
                <head><title>Redirecting...</title></head>
                <body>
                <script>
                    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                    if (token) {
                        window.location.href = '${req.originalUrl}' + (window.location.search ? '&' : '?') + 'token=' + token;
                    } else {
                        window.location.href = '/login';
                    }
                </script>
                </body>
                </html>
            `);
        }

        // Get token from various sources
        const token = req.headers.authorization?.split(' ')[1] || 
                     req.query?.token || 
                     req.cookies?.token;

        if (!token) {
            return res.redirect('/login');
        }

        // Verify token
        const decoded = verifyToken(token);
        const user = await User.findOne({ userName: decoded.userName });

        if (!user) {
            return res.redirect('/login');
        }

        // Add user to request
        req.user = user;
        req.auth = user;
        req.token = token;
        next();
    } catch (error) {
        console.error('Token authentication error:', error);
        return res.redirect('/login');
    }
};

export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || 
                     req.query?.token || 
                     req.cookies?.token ||
                     req.session?.token;

        if (token) {
            const decoded = verifyToken(token);
            const user = await User.findOne({ userName: decoded.userName });
            if (user) {
                req.user = user;
                req.auth = user;
                req.token = token;
            }
        }
        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};