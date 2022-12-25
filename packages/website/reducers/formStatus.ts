export enum FormStatusActionKind {
  'loading',
  'success',
  'error',
  'idle'
}

interface FormStatusAction {
  status: FormStatusActionKind;
  message?: string;
}

interface FormState {
  status: FormStatusActionKind;
  message: string;
}

export const formStatusInitialState: FormState = {
  status: FormStatusActionKind.idle,
  message: 'Idling...'
};

export function formStatusReducer(state: FormState, action: FormStatusAction): FormState {
  const { status, message } = action;
  switch (status) {
    case FormStatusActionKind.loading:
      return {
        status: FormStatusActionKind.loading,
        message: 'Loading...'
      };
    case FormStatusActionKind.success:
      return {
        status: FormStatusActionKind.success,
        message: 'Success!'
      };
    case FormStatusActionKind.error:
      return {
        status: FormStatusActionKind.error,
        message: message ?? 'Error!'
      };
    case FormStatusActionKind.idle:
      return {
        status: FormStatusActionKind.idle,
        message: ''
      };
    default:
      return state;
  }
}
