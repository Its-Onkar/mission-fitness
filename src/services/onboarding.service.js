import mongoose from "mongoose";
import Onboarding from "../Schema/onboarding.schema";


export const getOnboardingDataByUserId = async (userId) => {
    const onboardingData = await Onboarding.findOne({ userId }).populate('userId', 'name email');
    if (!onboardingData) {
        throw new Error("Onboarding data not found for the user");
    }
    return onboardingData;
  
}

export const createOnboardingData = async (onboardingData) => {
    const newOnboardingData = (await Onboarding.create(onboardingData));
    if (!newOnboardingData) {
        throw new Error("Onboarding data not created");
    }
    return newOnboardingData;
}

export const updateOnboardingData = async (userId, updateData) => {
    const onboardingData = await Onboarding.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { new: true, runValidators: true })
    if (!onboardingData) {
        throw new Error("Onboarding data not found or not updated");
    }
    return onboardingData;
}

export const markOnboardingComplete = async (userId) => {
  const updated = await Onboarding.findOneAndUpdate(
    { userId },
    { onboardingCompleted: true },
    { new: true }
  );

  if (!updated) {
    throw new Error("Failed to mark onboarding as complete");
  }

  return updated;
};

