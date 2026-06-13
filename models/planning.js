import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const planningSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  plan:   { type: Schema.Types.Mixed, default: {} }
}, { collection: 'plannings' })

const Planning = mongoose.model('Planning', planningSchema);
export default Planning;
