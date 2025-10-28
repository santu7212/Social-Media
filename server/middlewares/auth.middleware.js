export const protect = async (req, res, next) => {
  try {
    // console.log(req.auth());
    
    const { userId } = await req.auth();
    console.log(userId);
    
    if (!userId) {
      return res.json({ success: false, message: "Not authanticated or authorized " });
    }
    console.log("UserId",userId);
    
     next();

  } catch (error) {
     return res.json({ success: false, message:  error.message });
  }
};

 