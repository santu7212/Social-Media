const protect = async (req, res, next) => {
  try {
    console.log(req.auth());
    
    const { userId } = req.auth();
    if (!userId) {
      return res.json({ success: false, message: "Not authanticated " });
    }
    console.log("UserId",userId);
    
     next();

  } catch (error) {
     return res.json({ success: false, message:  error.message });
  }
};


export default protect