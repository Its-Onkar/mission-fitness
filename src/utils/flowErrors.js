/**
 * Custom error classes for user flow management
 * Provides specific error types for better error handling and debugging
 */

/**
 * Base class for all flow-related errors
 */
export class FlowError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isFlowError = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Thrown when user's flow state is invalid or corrupted
 */
export class FlowStateError extends FlowError {
    constructor(message = 'Invalid flow state detected', userId = null) {
        super(message, 400);
        this.userId = userId;
    }
}

/**
 * Thrown when user attempts an invalid flow transition
 */
export class InvalidFlowTransitionError extends FlowError {
    constructor(fromState, toState, userId = null) {
        super(`Invalid flow transition from ${fromState} to ${toState}`, 403);
        this.fromState = fromState;
        this.toState = toState;
        this.userId = userId;
    }
}

/**
 * Thrown when user tries to access a route requiring completed onboarding
 */
export class OnboardingIncompleteError extends FlowError {
    constructor(message = 'Onboarding must be completed to access this resource', userId = null) {
        super(message, 403);
        this.userId = userId;
        this.requiredStep = 'onboarding';
    }
}

/**
 * Thrown when user's email is not verified
 */
export class EmailNotVerifiedError extends FlowError {
    constructor(message = 'Email verification required', userId = null) {
        super(message, 403);
        this.userId = userId;
        this.requiredStep = 'email_verification';
    }
}

/**
 * Thrown when AI plans generation is required but not complete
 */
export class AIPlansRequiredError extends FlowError {
    constructor(message = 'AI plans must be generated to continue', userId = null) {
        super(message, 403);
        this.userId = userId;
        this.requiredStep = 'ai_plans';
    }
}

/**
 * Thrown when flow data is missing or corrupted
 */
export class FlowDataMissingError extends FlowError {
    constructor(missingData, userId = null) {
        super(`Required flow data missing: ${missingData}`, 500);
        this.missingData = missingData;
        this.userId = userId;
    }
}

/**
 * Helper function to check if an error is a flow error
 * @param {Error} error - Error to check
 * @returns {boolean} True if error is a flow error
 */
export function isFlowError(error) {
    return error && error.isFlowError === true;
}

/**
 * Converts flow errors to user-friendly response objects
 * @param {FlowError} error - Flow error to convert
 * @returns {Object} Response object with error details
 */
export function flowErrorToResponse(error) {
    if (!isFlowError(error)) {
        return {
            success: false,
            error: 'An unexpected error occurred',
            statusCode: 500
        };
    }

    return {
        success: false,
        error: error.message,
        errorType: error.name,
        statusCode: error.statusCode,
        ...(error.userId && { userId: error.userId }),
        ...(error.requiredStep && { requiredStep: error.requiredStep }),
        ...(error.fromState && { fromState: error.fromState }),
        ...(error.toState && { toState: error.toState })
    };
}

export default {
    FlowError,
    FlowStateError,
    InvalidFlowTransitionError,
    OnboardingIncompleteError,
    EmailNotVerifiedError,
    AIPlansRequiredError,
    FlowDataMissingError,
    isFlowError,
    flowErrorToResponse
};
