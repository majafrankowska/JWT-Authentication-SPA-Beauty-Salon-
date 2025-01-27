authService = require("../services/AuthService");



exports.register = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  try {

    const role = req.body.role || 'client'; 

    const userId = await authService.register(
      username,
      email,
      password,
      role
    );
    res.status(201).json({
      message: "User registered successfully",
      userId,
    });
  } catch (error) {
    next(error);
  }
};



exports.login = async (req, res, next) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: "loginError.missingFields" });
  }

  try {
    const response = await authService.login(identifier, password);
    res.status(200).json({
      message: "Login successful",
      userId: response.user.id,
      username: response.user.username,
      email: response.user.email,
      role: response.user.role,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken
    });

  } catch (error) {
    next(error);
  }
};


exports.logout = async (req, res, next) => {
  const { identifier, refreshToken } = req.body;
  console.log("Logout Request:", { identifier, refreshToken }); 

  if (!identifier || !refreshToken) {
    return res.status(400).json({ message: "logoutError.missingFields" });
  }

  try {
    const response = await authService.logout(identifier, refreshToken);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error during logout:", error); 
    next(error);
  }
};




exports.refreshToken = async (req, res, next) => {
  const { username, refreshToken } = req.body;

  try {
    const response = await authService.refreshToken(username, refreshToken);
    res.status(200).json(response);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
};
