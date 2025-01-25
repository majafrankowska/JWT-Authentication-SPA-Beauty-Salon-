const { CustomError } = require("../errors/CustomError");

module.exports = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err); 
  res.status(500).json({ message: "Internal Server Error" });
};


