import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
  lecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: [true, "Please enter a lecture"],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  watchTime: {
    type: Number,
    default: 0,
  },
  lastWatched: {
    type: Date,
    default: Date.now,
  },
});

const courseProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, " user reference is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, " course reference is required"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lecturesProgress: [lectureProgressSchema],
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

courseProgressSchema.pre("save", function (next) {
  if (this.lecturesProgress.length > 0) {
    const completedLectures = this.lecturesProgress.filter(
      (lp) => lp.isCompleted
    ).length;
    this.completionPercentage = Math.round(
      (completedLectures / this.lecturesProgress.length) * 100
    );
    this.isCompleted = this.completionPercentage === 100 ? true : false;
  }
  next();
});

courseProgressSchema.methods.updateLastAccessed = function () {
  this.lastAccessed = Date.now();
  return this.save({ validateBeforeSave: false });
};

export const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);
