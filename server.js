// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose
  .connect("mongodb://localhost:27017/usersdb")
  .then(() => console.log("✅ Подключено к MongoDB"))
  .catch((err) => console.error("❌ Ошибка подключения к MongoDB:", err));

// Схема пользователя
const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  address: {
    street: String,
    suite: String,
    city: String,
    zipcode: String,
  },
  phone: String,
  website: String,
  company: {
    name: String,
    catchPhrase: String,
    bs: String,
  },
});

// Модель пользователя
const User = mongoose.model("User", userSchema);

// Роуты
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "Пользователь не найден" });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send({ error: "Пользователь не найден" });
    }
    res.send(user);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "Пользователь не найден" });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Запуск сервера
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
