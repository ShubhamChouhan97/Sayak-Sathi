import bcrypt from 'bcrypt';
import userModel from '../models/user.js'; // Adjust the path as necessary

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({
            error: 'Email is not valid',
        });
    }
    const isMatch = await bcrypt.compare(password, user.password); // ✅ using bcrypt directly

    if (!isMatch) {
        return res.status(400).json({ error: 'Password is not valid' });
    }
    if (user.status !== 1) {
        return res.status(400).json({
            error: 'User is not active',
        });
    }

    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.role = user.role;
    req.session.name = user.name;
    req.session.courtId = user.courtId;
    req.session.phoneNumber = user.phoneNumber;
    req.session._internal = {};
    return res.json({ message: 'success' });
};