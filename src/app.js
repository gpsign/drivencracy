import express from "express"
import dotenv from "dotenv"

const app = express()
app.use(express.json())
dotenv.config()

const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`)
})