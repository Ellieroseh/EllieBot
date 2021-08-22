import mongoose from 'mongoose';

interface UsersTypes {
	uid: number;
	userName: string;
}

//Users Schema
const Users = new mongoose.Schema<UsersTypes>(
	{
		uid: {
			type: 'Number',
		},
		userName: {
			type: 'String',
		},
	},

	{ timestamps: true }
);

export default mongoose.model<UsersTypes>('Users', Users);
