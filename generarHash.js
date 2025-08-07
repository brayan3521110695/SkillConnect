const bcrypt = require("bcryptjs");

const password = "678910";

bcrypt.hash(password, 12).then(result => {
  console.log("Nuevo hash generado:", result);
});
