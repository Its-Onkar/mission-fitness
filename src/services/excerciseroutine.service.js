import  {ExerciseRoutine} from "../Schema/excerciseroutine.schema.js"



export const createRoutine = async (data, userId) => {
  return await ExerciseRoutine.create({ ...data, createdBy: userId, userId });
};



export const getUserRoutines = async (userId) => {
  return await ExerciseRoutine.find({ userId });
};

export const getUserRoutinesById = async (id)=>{
    return await ExerciseRoutine.find({id})
};
export const updateRoutine = async (Id, updates) => {
  return await ExerciseRoutine.findByIdAndUpdate(Id, updates, {
    new: true,
  });
};

// Delete routine
export const deleteRoutine = async (Id) => {
  return await ExerciseRoutine.findByIdAndDelete(Id);
};
