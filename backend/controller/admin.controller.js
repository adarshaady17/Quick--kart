import jwt from 'jsonwebtoken';

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (password === process.env.ADMIN_PASSWORD && email === process.env.ADMIN_EMAIL) {
            const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '7d' });

            res.cookie('adminToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.json({ success: true, message: "Logged In" });
        } else {
            return res.json({ success: false, message: "Invalid Credentials" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const isAdminAuth = async (req, res) => {
    try {
        return res.json({ success: true })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const adminLogout = async (req, res) => {
    try {
        res.clearCookie('adminToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        
        // Send success response
        return res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}