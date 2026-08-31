import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const ProgressSchema = new Schema(
    {
        translations: { type: Number, default: 0 },
        listeningCorrect: { type: Number, default: 0 },
        readingSessions: { type: Number, default: 0 },
        quizCorrect: { type: Number, default: 0 },
        streak: { type: Number, default: 0 },
        lastActiveDate: { type: String, default: null },
        lastTopic: { type: String, default: null },
    },
    { _id: false },
);

const OnboardingSchema = new Schema(
    {
        displayName: { type: String, default: "" },
        nativeLanguage: { type: String, default: "en" },
        learningLanguage: { type: String, default: "fr" },
        goal: {
            type: String,
            enum: ["travel", "work", "school", "fun", "family", "other"],
            default: "fun",
        },
        dailyMinutes: { type: Number, default: 10 },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date, default: null },
    },
    { _id: false },
);

const UserSchema = new Schema(
    {
        name: { type: String, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        passwordHash: { type: String, select: false },
        image: { type: String },
        emailVerified: { type: Date, default: null },
        onboarding: { type: OnboardingSchema, default: () => ({}) },
        progress: { type: ProgressSchema, default: () => ({}) },
    },
    { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof UserSchema> & {
    _id: Schema.Types.ObjectId;
};

export const User: Model<UserDocument> =
    (models.User as Model<UserDocument>) || model<UserDocument>("User", UserSchema);
