const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Accepts POST requests at /message endpoint
app.post("/api/message", async (req, res) => {
  try {
    // Parse the request body from the POST
    let message = req.body;

    console.log("Processing message: " + JSON.stringify(message));

    if (!message.message || message.message.length === 0) {
      return res.status(400).send("Invalid message");
    }

    const response = await openai.createCompletion("text-davinci-002", {
      prompt:
        "The following is a conversation with an WhatsApp AI Chatbot with name Winnie created by Amit Wani. The bot is helpful, creative, clever, and very friendly. \n\nHuman: " +
        message.message +
        "\nAI: ",
      temperature: 0.9,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    });

    let reply = "";

    for (const result of response.data.choices) {
      reply += result.text + "\n";
    }

    console.log("Reply: " + reply);

    return res.status(200).send({ reply });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Sets server port and logs message on success
app.listen(process.env.PORT || 8080, () =>
  console.log("Whatsapp Chatbot is listening")
);
