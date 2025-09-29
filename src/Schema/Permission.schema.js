import mongoose, { Schema } from "mongoose";

const PermissionSchema = new Schema(
  {
    emailUpdates: { type: Boolean, default: false },
    locationAccess: { type: Boolean, default: false },
    healthTracking: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Permission = mongoose.model("Permission", PermissionSchema);
export default Permission;
