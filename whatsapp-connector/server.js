const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const axios = require("axios").default;

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Accepts POST requests at /webhook endpoint
app.post("/api/webhook", async (req, res) => {
  try {
    // Parse the request body from the POST
    const body = req.body;

    // Check the Incoming webhook message
    console.log("Incoming webhook: " + JSON.stringify(body));

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
                  console.log(
                    "Message from " + waid + " - " + userName + ": " + text
                  );

                  let reply = "";

                  try {
                    const chatbotResponse = await axios.post(
                      process.env.CHATBOT_URL,
                      {
                        message: text,
                      },
                      {
                        headers: {
                          "Content-Type": "application/json",
                        },
                      }
                    );

                    reply = chatbotResponse.data.reply;
                  } catch (chatbotError) {
                    console.error(
                      "Error while receiving message from Chatbot: " +
                        chatbotError
                    );

                    reply =
                      "Sorry, I am not able to reply to your message right now. Please try again later.";
                  }

                  console.log("Replying to " + waid + ": " + reply);

                  // Send reply to user

                  try {
                    await axios.post(
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
                  } catch (whatsappSendError) {
                    console.error(
                      "Error while sending message to whatsapp: " +
                        JSON.stringify(whatsappSendError.response.data)
                    );
                  }
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
app.get("/api/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  console.log("PAR" + JSON.stringify(req.query));

  // Check if a token and mode were sent
  if (!mode || !token) {
    return res.status(403).send({ error: "Missing mode or token" });
  }

  // Check the mode and token sent are correct
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    // Respond with 200 OK and challenge token from the request
    console.log("WEBHOOK_VERIFIED");
    return res.status(200).send(challenge);
  } else {
    // Responds with '403 Forbidden' if verify tokens do not match
    return res.sendStatus(403);
  }
});

// Sets server port and logs message on success
app.listen(process.env.PORT || 8081, () =>
  console.log("Whatsapp Connector is listening")
);
