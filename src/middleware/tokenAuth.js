import { verifyToken } from "../utils/auth.utils.js";
import User from "../Schema/user.schema.js";

export const authenticateToken = async (req, res, next) => {
    try {
        // For API requests, handle differently than browser navigation
        const isApiRequest = req.path.startsWith('/api/');
        
        // For browser navigation, render a page that checks localStorage/sessionStorage
        if (!isApiRequest && !req.headers.authorization && !req.query?.token && !req.cookies?.token) {
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
                        // Clear any expired tokens
                        localStorage.removeItem('token');
                        sessionStorage.removeItem('token');
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
            if (isApiRequest) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Authentication token required' 
                });
            }
            return res.redirect('/login');
        }

        // Verify token
        const decoded = verifyToken(token);
        
        if (!decoded || !decoded.userName) {
            throw new Error('Invalid token payload');
        }
        
        const user = await User.findOne({ userName: decoded.userName });

        if (!user) {
            if (isApiRequest) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }
            return res.redirect('/login');
        }

        // Add user to request
        req.user = user;
        req.auth = user;
        req.token = token;
        next();
        
    } catch (error) {
        console.error('Token authentication error:', error);
        
        const isApiRequest = req.path.startsWith('/api/');
        
        // If token expired, clear it and redirect to login
        if (error.message.includes('expired')) {
            if (isApiRequest) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Token has expired',
                    expired: true
                });
            }
            return res.send(`
                <!DOCTYPE html>
                <html>
                <head><title>Session Expired</title></head>
                <body>
                <script>
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    alert('Your session has expired. Please login again.');
                    window.location.href = '/login';
                </script>
                </body>
                </html>
            `);
        }
        
        if (isApiRequest) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication failed',
                error: error.message
            });
        }
        
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
