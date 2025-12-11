const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tholde REST API Documentation",
      version: "1.0.0",
      description: "API for user management and authentication for PIZZA KM",
    },
    servers: [
      {
<<<<<<< HEAD
        url: "http://localhost:3000",
=======
        url: "http://localhost:3000/",
>>>>>>> b13ebdf (add crud menu)
      },
    ],
  },
  apis: ["./src/routes/api/*.ts"],
};

export default swaggerOptions;
