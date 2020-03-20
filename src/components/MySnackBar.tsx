// @flow

import {NativeModules, processColor} from 'react-native';

// TypeScript typings.

/**
 * An optional, actionable button on the Snackbar.
 */
export interface SnackbarAction {
    /**
     * Button text.
     */
    text: string;

    /**
     * Button text color.
     * Accepts various forms of colors such as hex, literals, rgba, etc.
     */
    textColor?: string | number;

    /**
     * Function called when the user taps the button.
     */
    onPress?(): void;
}

/**
 * Snackbar configuration options.
 */
export interface SnackBarOptions {
    /**
     * Snackbar text.
     */
    text: string;

    /**
     * Length of time the Snackbar stays on screen.
     * Must be one of Snackbar.LENGTH_SHORT, Snackbar.LENGTH_LONG, or Snackbar.LENGTH_INDEFINITE.
     */
    duration?: number;

    /**
     * Snackbar text color.
     * Accepts various forms of colors such as hex, literals, rgba, etc.
     */
    textColor?: string | number;

    /**
     * Background color of the snackbar.
     * Accepts color strings such as hex, literals, rgba
     */
    backgroundColor?: string;

    /**
     * [Android] The basename of a .ttf font from assets/fonts/.
     */
    fontFamily?: string;

    /**
     * Action button configuration options.
     */
    action?: SnackbarAction;
}

/**
 * Static Snackbar attributes.
 */
export interface SnackbarStatic {
    /**
     * Snackbar duration of about one second (varies per device).
     */
    LENGTH_SHORT: number;

    /**
     * Snackbar duration of about three seconds (varies per device).
     */
    LENGTH_LONG: number;

    /**
     * Snackbar duration that lasts forever (until dismissed, replaced, or action button is tapped).
     */
    LENGTH_INDEFINITE: number;

    /**
     * Shows a native Snackbar component.
     */
    show(options: SnackBarOptions): void;

    /**
     * Dismisses any and all active Snackbars.
     */
    dismiss(): void;
}

// declare const Snackbar: SnackbarStatic;
// export default Snackbar;

/**
 * An optional, actionable button on the Snackbar.
 */
type Action = {
    /**
     * Button text.
     */
    text: string,

    /**
     * Button text color.
     * Accepts various forms of colors such as hex, literals, rgba, etc.
     */
    textColor?: string | number,

    /**
     * Function called when the user taps the button.
     */
    onPress?: () => void,
};

/**
 * Snackbar configuration options.
 */
type options = {
    /**
     * Snackbar text.
     */
    text: string, /**

     /**
     * Length of time the Snackbar stays on screen.
     * Must be one of Snackbar.LENGTH_SHORT, Snackbar.LENGTH_LONG, or Snackbar.LENGTH_INDEFINITE.
     */
    duration?: number,

    /**
     * Snackbar text color.
     * Accepts various forms of colors such as hex, literals, rgba, etc.
     */
    textColor?: string | number,


    /**
     * Background color of the snackbar.
     * Accepts color strings such as hex, literals, rgba
     */
    backgroundColor?: string,

    /**
     * [Android] The basename of a .ttf font from assets/fonts/.
     */
    fontFamily?: string,

    /**
     * Action button configuration options.
     */
    action?: Action,
};

/**
 * Static Snackbar attributes.
 */
type ISnackBar = {
    /**
     * Snackbar duration of about one second (varies per device).
     */
    LENGTH_SHORT: number,

    /**
     * Snackbar duration of about three seconds (varies per device).
     */
    LENGTH_LONG: number,

    /**
     * Snackbar duration that lasts forever (until dismissed, replaced, or action button is tapped).
     */
    LENGTH_INDEFINITE: number,

    /**
     * Shows a native Snackbar component.
     */
    show: (options: options) => void,

    /**
     * Dismisses any and all active Snackbars.
     */
    dismiss: () => void,
};

const SnackBar: ISnackBar = {
    LENGTH_LONG      : NativeModules.RNSnackbar.LENGTH_LONG,
    LENGTH_SHORT     : NativeModules.RNSnackbar.LENGTH_SHORT,
    LENGTH_INDEFINITE: NativeModules.RNSnackbar.LENGTH_INDEFINITE,

    show(options: options) {

        const text = options.text;

        const textColorRaw = options.textColor;

        const textColor       = textColorRaw && processColor(textColorRaw);
        const backgroundColor = options.backgroundColor && processColor(options.backgroundColor);

        const action: any = options.action || {};

        const actionText = action.text || action.title;
        delete action.title;
        const actionTextColorRaw = action.textColor || action.color;
        delete action.color;
        const actionTextColor = actionTextColorRaw && processColor(actionTextColorRaw);
        const onPressCallback = action.onPress || (() => {
        });

        const nativeOptions = {
            ...options,
            text,
            textColor,
            backgroundColor,
            action: options.action ? {
                ...action,
                text     : actionText,
                textColor: actionTextColor,
            } : undefined,
        };

        NativeModules.RNSnackbar.show(nativeOptions, onPressCallback);
    },

    dismiss() {
        NativeModules.RNSnackbar.dismiss();
    },
};

const warnDeprecation = (options: any, deprecatedKey: any, newKey: any) => {
    if (options && options[deprecatedKey]) {
        console.warn(`The Snackbar '${deprecatedKey}' option has been deprecated. Please switch to '${newKey}' instead.`);
    }
}

export default SnackBar;
