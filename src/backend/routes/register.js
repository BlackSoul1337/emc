app.post('/api/users/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone, iin } = req.body;

        if (!email || !password || !iin) {
            return res.status(400).json({ message: 'missing req fields' });
        }

        const userExists = await User.findOne({ $or: [{ email }, { iin }] });
        if (userExists) {
            return res.status(400).json({ message: 'user alr exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
            iin,
            role: 'patient',
            isActivated: false,
            activationLink: uuidv4()
        });

        await newUser.save();
        //emailpotom
        res.status(201).json({ message: 'success' });

    } catch (error) {
        res.status(500).json({ message: 'serv error' });
    }
});