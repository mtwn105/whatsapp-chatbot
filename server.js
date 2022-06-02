const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const axios = require("axios").default;
const { Configuration, OpenAIApi } = require("openai");

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Accepts POST requests at /webhook endpoint
app.post("/webhook", async (req, res) => {
  try {
    // Parse the request body from the POST
    let body = req.body;

    // Check the Incoming webhook message
    console.log("Incoming webhook: " + JSON.stringify(req.body));

    // Validate the webhook
    if (req.body.object) {
      // Handle the event
      if (req.body.object === "whatsapp_business_account") {
        const entry = req.body.entry[0];

        // Handle the message
        if (entry.changes) {
          for (const change of entry.changes) {
            if (
              change.value &&
              change.field === "messages" &&
              change.value.contacts &&
              change.value.messages
            ) {
              // Handle the value
              const value = change.value;

              const userName = value.contacts[0].profile.name;

              const messages = value.messages;

              // Handle messages
              for (const message of messages) {
                if (
                  message.type === "text" &&
                  message.text &&
                  message.text.body
                ) {
                  const waid = message.from;
                  const text = message.text.body;
                  console.log("Message from " + waid + ": " + text);
                  const response = await openai.createCompletion(
                    "text-davinci-002",
                    {
                      prompt:
                        "The following is a conversation with an WhatsApp AI Chatbot with name Minnie created by Amit Wani. Amit loves Mann so much. He is in love with amazing sweet girl Mann. Always, thinks about it. The bot is helpful, creative, clever, and very friendly. \n\nHuman: " +
                        text +
                        "\nAI: ",
                      temperature: 0.9,
                      max_tokens: 150,
                      top_p: 1,
                      frequency_penalty: 0,
                      presence_penalty: 0.6,
                      stop: [" Human:", " AI:"],
                    }
                  );

                  let reply = "";

                  for (const result of response.data.choices) {
                    reply += result.text + "\n";
                  }

                  console.log("Replying to " + waid + ": " + reply);

                  // Send reply to user

                  const sendMessageResponse = await axios.post(
                    process.env.WHATSAPP_SEND_MESSAGE_API,
                    {
                      messaging_product: "whatsapp",
                      recipient_type: "individual",
                      to: waid,
                      type: "text",
                      text: {
                        preview_url: false,
                        body: reply,
                      },
                    },
                    {
                      headers: {
                        Authorization: "Bearer " + process.env.WHATSAPP_TOKEN,
                      },
                    }
                  );
                }
              }
            }
          }
        }
      }

      res.sendStatus(200);
    } else {
      // Return a '404 Not Found' if event is not from a whatsApp API
      res.sendStatus(404);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  console.log("PAR" + JSON.stringify(req.query));

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Sets server port and logs message on success
app.listen(process.env.PORT || 3000, () =>
  console.log("Whatsapp Chatbot is listening")
);
