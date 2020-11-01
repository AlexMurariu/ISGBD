import { v4 as uuidv4 } from 'uuid';

export const NotificationTypes = {
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'info',
};

export class NotificationModel { 
    id: string;
    message: string;
    title: string;
    type: string;
    requireConfirmation: boolean;
    confirmationCallback?: Function;

    static createSuccessNotification(title: string, message: string, requireConfirmation = false, confirmationCallback?: Function): NotificationModel {
        return new NotificationModel(title, message, NotificationTypes.success, requireConfirmation, confirmationCallback)
    }

    static createWarningNotification(title: string, message: string, requireConfirmation = false, confirmationCallback?: Function): NotificationModel {
        return new NotificationModel(title, message, NotificationTypes.warning, requireConfirmation, confirmationCallback)
    }

    static createErrorNotification(title: string, message: string, requireConfirmation = false, confirmationCallback?: Function): NotificationModel {
        return new NotificationModel(title, message, NotificationTypes.error, requireConfirmation, confirmationCallback)
    }

    static createInfoNotification(title: string, message: string, requireConfirmation = false, confirmationCallback?: Function): NotificationModel {
        return new NotificationModel(title, message, NotificationTypes.info, requireConfirmation, confirmationCallback)
    }

    constructor(title: string, message: string, type: string, requireConfirmation = false, confirmationCallback?: Function) {
        this.id = uuidv4();
        this.title = title;
        this.message = message;
        this.type = type;
        this.requireConfirmation = requireConfirmation;
        this.confirmationCallback = typeof confirmationCallback === 'function' ? confirmationCallback : () => {};
    }

    get isSuccessType(): boolean {
        return this.type === NotificationTypes.success;
    }

    get isWarningType(): boolean {
        return this.type === NotificationTypes.warning;
    }

    get isErrorType(): boolean {
        return this.type === NotificationTypes.error;
    }

    get isInfoType(): boolean {
        return this.type === NotificationTypes.info;
    }
}