import express from "express";
import { readFileSync, writeFileSync } from "fs";

const app = express();
app.use(express.json());

// Render usa a porta que ele define na env
const port = process.env.PORT || 3333;

app.get("/", (req, res) => {
  try {
    const fileBuffer = readFileSync("./data.json");
    const fileText = fileBuffer.toString();
    const fileData = JSON.parse(fileText);

    res.json(fileData);
  } catch (error) {
    console.error("Algo inesperado ocorreu =", error.message);
    res.status(500).send("Internal server error");
  }
});

app.post("/", (request, response) => {
  try {
    const fileBuffer = readFileSync("./data.json");
    const fileText = fileBuffer.toString();
    const highScores = JSON.parse(fileText);

    const playerIndex = highScores.findIndex(
      (element) => element.player === request.body.player
    );

    if (playerIndex === -1) {
      highScores.push({
        player: request.body.player,
        score: request.body.score,
      });
    } else if (request.body.score < highScores[playerIndex].score) {
      highScores[playerIndex].score = request.body.score;
    }

    writeFileSync("./data.json", JSON.stringify(highScores));

    response.json({ message: "OK" });
  } catch (error) {
    console.error(error.message);
    response.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
