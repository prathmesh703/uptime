export interface SignupOutgoingMessage{
    validatorId: string;
    callbackId: string;
}

export interface ValidateOutgoingMessage{
    callbackId: string;
    url: string;
    websiteId: string;
}

export interface SignupIncomingMessage {
    callbackId: string;
    publickey: string;
    signedMessage: string;
    ip: string;
}

export interface ValidateIncomingMessage {
    callbackId: string;
    validatorId: string;
    websiteId: string;
    signedMessage: string;
    latency: number;
    status: 'Good' | 'Bad';
}

export type IncomingMessage = {
    type: 'signup'
    data: SignupIncomingMessage
} | {
    type: 'validate'
    data: ValidateIncomingMessage
}

export type OutgoingMessage = {
    type: 'signup'
    data: SignupOutgoingMessage
} | {
    type: 'validate'
    data: ValidateOutgoingMessage
}