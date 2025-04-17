import jwt from "jsonwebtoken"

export const isLoggedIn = async (req, res, next) => {
    
    try {
        const token = req.cookies.token || ''
        // const token = req.cookies?.token 
        // both lines are same

        if(!token){
            return res.status(401).json({
                message: "Authentication failed",
                success: false
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded; // make new user and put decoded data in that

        next();

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

