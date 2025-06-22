import mongoose, { Schema } from 'mongoose';

export interface ITask {
  _id?: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: { 
      type: String, 
      required: [true, 'Please provide a title for this task'],
      maxlength: [60, 'Title cannot be more than 60 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for this task'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    }
  },
  { 
    timestamps: true 
  }
);

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
