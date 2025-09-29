export const homePageController = async (req, res) => {
    res.render("home", {
        title: "Home Page",
    });
}

export const resetPasswordController = async (req, res) => {
    res.render("reset-password", {
        title: "Reset Password",
        token: req.query.token,
    });
};

export const dashboardController = async (req, res) => {
    res.render("dashboard", {
        title: "Dashboard",
    });
};

export const navbarcontroller = async (req, res) => {
    res.render("navbar", {
        title: "Navbar",
    });
};

import { generateToken } from "../utils/auth.utils.js";

export const signupviewController = async (_req, res) => {
    try {
        // Generate a simple CSRF token for form protection
        const csrfToken = generateToken({ 
            type: 'csrf', 
            timestamp: Date.now() 
        }, '1h');
        
        res.render("sign-up", {
            title: "Signup",
            token: csrfToken
        });
    } catch (error) {
        console.error("Error generating token for signup view:", error);
        res.render("sign-up", {
            title: "Signup",
            
        });
    }
};

export const onboardingviewController = async (req,res)=>{
    res.render("onboarding",
        {
           title:"onboarding" 
        }
    )
}


export const loginviewController = async (req, res) => {
    try {
        const token = generateToken(
            { type: "csrf", timestamp: Date.now() },
            "1h"
        );

        res.render("login", {
            title: "Login",
            token: token,
        });
    } catch (error) {
        console.error("Error generating token for login view:", error);
        res.render("login", {
            title: "Login",
        });
    }
};