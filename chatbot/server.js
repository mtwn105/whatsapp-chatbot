const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const { connectToRedis } = require("./redis");

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

let redisClient = null;
connectToRedis().then((client) => (redisClient = client));

const promptBeginning =
  "The following is a conversation with an WhatsApp AI Chatbot with name Winnie created by Amit Wani. Amit Wani has a twitter account on @mtwn105 along with that he runs a Blog built using Hashnode on blog.amitwani.dev. This bot is helpful, creative, clever, and very friendly. It is created using NodeJS, WhatsApp Cloud API and deployed on Linode using docker. \n\nHuman:";

// Accepts POST requests at /message endpoint
app.post("/api/message", async (req, res) => {
  try {
    // Parse the request body from the POST
    let request = req.body;

    console.log("Processing message: " + JSON.stringify(request));

    if (
      !request.message ||
      request.message.length === 0 ||
      request.waid === ""
    ) {
      return res.status(400).send("Invalid message");
    }

    // Get value from redis using waid
    let conversationValue = await redisClient.get(request.waid);
    let conversation = [];

    console.log("Value from redis: " + conversationValue);

    let prompt = null;

    if (!conversationValue) {
      prompt = promptBeginning + request.message + "\nWinnie: ";
    } else {
      conversation = JSON.parse(conversationValue);
      // Filter only last 5 messages
      conversation = conversation.slice(
        Math.max(conversation.length - 5, 0),
        conversation.length
      );

      console.log("Length of conversation: " + conversation.length);

      const conversationString = conversation.join("\n");
      console.log("Conversation String: " + conversationString);
      prompt =
        conversationString + promptBeginning + request.message + "\nWinnie: ";
    }

    console.log("Prompt: " + prompt);

    const response = await openai.createCompletion("text-davinci-002", {
      prompt: prompt,
      temperature: 0.9,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: [" Human:", " Winnie:"],
    });

    let reply = "";

    for (const result of response.data.choices) {
      reply += result.text + "\n";
    }

    console.log("Reply: " + reply);

    conversation.push("Human: " + request.message + "\nWinnie: " + reply);

    console.log("Conversation: " + JSON.stringify(conversation));

    // Save value to redis using waid
    await redisClient.set(request.waid, JSON.stringify(conversation));

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
