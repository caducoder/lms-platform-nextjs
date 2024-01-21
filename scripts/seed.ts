const { PrismaClient } = require("@prisma/client")

const database = new PrismaClient()

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Ciência da Computação" },
        { name: "Música" },
        { name: "Musculação" },
        { name: "Fotografia" },
        { name: "Edição de vídeo" },
      ]
    })

    console.log("Success")
  } catch (error) {
    console.log("Erro seeding the database categories", error)
  } finally {
    await database.$disconnect()
  }
}

main()