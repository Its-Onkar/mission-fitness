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

export const signupviewController = async (req, res) => {
    res.render("sign-up", {
        title: "Signup",
    });
};