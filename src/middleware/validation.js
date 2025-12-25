import * as yup from 'yup';

export const validateOnboarding = async (req, res, next) => {
  const schema = yup.object({
    gender: yup.string().required().oneOf(['male', 'female']),
    age: yup.number().required().min(13).max(120),
    heightCm: yup.number().required().min(100).max(250),
    weightKg: yup.number().required().min(30).max(200),
    goal: yup.string().required(),
    fitnessLevel: yup.string().required(),
    activityLevel: yup.string().required(),
    workoutPreference: yup.string().required(),
    dietPreference: yup.string().required(),
    exerciseFrequency: yup.object({
      timesPerWeek: yup.number().required().min(1).max(7)
    }).required()
  });

  try {
    await schema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Validation failed', message: error.message });
  }
};

export const validateAuth = async (req, res, next) => {
  const schema = yup.object({
    userName: yup.string().required().min(3),
    email: yup.string().required().email(),
    password: yup.string().required().min(6)
  });

  try {
    await schema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Validation failed', message: error.message });
  }
};

export const validateLogin = async (req, res, next) => {
  const schema = yup.object({
    userName: yup.string().required(),
    password: yup.string().required()
  });

  try {
    await schema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Validation failed', message: error.message });
  }
};
