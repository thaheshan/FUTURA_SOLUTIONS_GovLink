import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SignupData {
	email: string;
	password: string;
	first_name?: string;
	last_name?: string;
	username?: string;
}

interface SignupContextType {
	step: number;
	setStep: (step: number) => void;
	signupData: SignupData;
	setSignupData: (data: Partial<SignupData>) => void;
	verificationCode: string;
	setVerificationCode: (code: string) => void;
	reset: () => void;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const useSignupContext = () => {
	const ctx = useContext(SignupContext);
	if (!ctx) throw new Error('useSignupContext must be used within SignupProvider');
	return ctx;
};

export const SignupProvider = ({ children }: { children: ReactNode }) => {
	const [step, setStep] = useState(1);
	const [signupData, setSignupDataState] = useState<SignupData>({
		email: '',
		password: '',
		username: '',
	});
	const [verificationCode, setVerificationCode] = useState('');

	const setSignupData = (data: Partial<SignupData>) => {
		setSignupDataState(prev => ({ ...prev, ...data }));
	};

	const reset = () => {
		setStep(1);
		setSignupDataState({ email: '', password: '', first_name: '', last_name: '', username: '' });
		setVerificationCode('');
	};

	return (
		<SignupContext.Provider
			value={{ step, setStep, signupData, setSignupData, verificationCode, setVerificationCode, reset }}
		>
			{children}
		</SignupContext.Provider>
	);
};
