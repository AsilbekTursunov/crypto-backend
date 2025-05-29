import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import { Router } from "express";
import jwt from 'jsonwebtoken';
import { sendMessage } from "../lib/email.js";
const router = Router();

function generateToken(userId, email) {
  const accessToken = jwt.sign({ userId, email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "14d",
  });
  return accessToken;
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;


    const existEmail = await User.findOne({ email });
    if (existEmail) return res.status(400).json({ error: 'Email already exists' });

    const exitUsername = await User.findOne({ username });
    if (exitUsername) return res.status(400).json({ error: 'This username already taken by users' });

    // get random image from unsplash
    const profileImage = `https://api.dicebear.com/7.x/avataaars/png?seed=${username}`;
    // Hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashedPassword, username, image: profileImage });
    // await user.save(); 

    const token = generateToken(user._id, user.email);
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, username: user.username, image: user.image, createdAt: user.createdAt },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: { message: error.message } });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (!userExist) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, userExist.password);
    if (!validPassword) return res.status(400).json({ error: 'Password is invalid' });

    const token = generateToken(userExist._id, email);
    return res.json({ token, user: { id: userExist._id, email: userExist.email, username: userExist.username, image: userExist.image, createdAt: userExist.createdAt } });

  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
})

router.get('/refresh', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (typeof decoded != 'object') {
      return res.status(500).json({ error: 'Invalid Token' });
    }
    const newToken = generateToken(decoded.userId, decoded.email);

    const user = await User.findOne({ email: decoded.email })

    res.status(201).json({
      token: newToken,
      user: { id: decoded.userId, email: decoded.email, username: user.username, image: user.image, createdAt: user.createdAt },
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
})

router.post('/forget-password', async (req, res) => {
  try {
    const { email, code } = req.body

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: 'User not found' });


    sendMessage(email, user.username, code)

    res.json({ message: 'Message sent' })
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
})

router.post('/reset-password', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await User.updateOne({ email }, { $set: { password: hashedPassword } });
    res.json({ message: 'Password reset successfully' })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: { message: error.message } });

  }
})

router.get('/coins', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd`,
      {
        method: 'GET',
        headers: {
          "x-cg-demo-api-key": "CG-mH4cERDndy92fwRYm2MsHqJv",
        },
        params: {
          per_page: 100
        }
      }
    );
    const data = await response.json()
    return res.json({ coins: data })
  } catch (error) {
    return res.json({ error: 'Server error' })
  }
})
router.get('/exchanges', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/exchanges`,
      {
        method: 'GET',
        headers: {
          "x-cg-demo-api-key": "CG-mH4cERDndy92fwRYm2MsHqJv",
        },
        params: {
          per_page: 100
        }
      }
    );
    const data = await response.json()
    return res.json({ exchanges: data })
  } catch (error) {
    return res.json({ error: 'Server error' })
  }
})

router.get('/exchange/:id', async (req, res) => {
  const id = req.params.id
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/exchanges/${id}`,
      {
        method: 'GET',
        headers: {
          "x-cg-demo-api-key": "CG-mH4cERDndy92fwRYm2MsHqJv",
        },
        params: {
          per_page: 100
        }
      }
    );
    const data = await response.json()
    return res.json({ details: data })
  } catch (error) {
    return res.json({ error: 'Server error' })
  }
})
router.get('/coin/:id', async (req, res) => {

  const id = req.params.id

  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`, {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-mH4cERDndy92fwRYm2MsHqJv' }
    });
    const data = await response.json()
    console.log(data);

    return res.json({ details: data })
  } catch (error) {
    return res.json({ error: 'Server error' })
  }
})

router.get('/news', async (req, res) => {
  try {
    const prices = await fetch(
      `https://cryptocurrency-news2.p.rapidapi.com/v1/cryptodaily`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '19f52f8ce7msh869e47b46a27db0p186d38jsn4f8679603bb5',
        'x-rapidapi-host': 'cryptocurrency-news2.p.rapidapi.com'
      }
    }
    )
    const { data } = await prices.json()
    return res.json({ news: data })
  } catch (error) {
    return res.json({ error: 'Server error' })
  }
})


export default router;