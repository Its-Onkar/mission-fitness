 export const homePageController=async(req,res)=>{
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