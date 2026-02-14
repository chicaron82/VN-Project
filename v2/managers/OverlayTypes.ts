/**
 * OverlayTypes - Shared types for the Overlay system
 * Extracted from OverlayManager.ts (786 lines → ~100 lines types)
 *
 * V1 Parity: overlay-manager.js lines 36-83
 * 848 is sacred. 💚🔥💀
 */

export type OverlayVariant = 'primary' | 'error' | 'warning' | 'success';
export type ButtonVariant = 'primary' | 'error' | 'warning' | 'success' | 'cancel';

export interface BaseOverlayOptions {
    id?: string | null;
    className?: string;
    zIndex?: number;
    fadeIn?: boolean;
    onClick?: ((e: Event) => void) | null;
}

export interface BoxOptions {
    variant?: OverlayVariant;
    maxWidth?: string;
    padding?: string;
    className?: string;
}

export interface TitleOptions {
    variant?: OverlayVariant;
    emoji?: string;
    fontSize?: string;
    className?: string;
}

export interface MessageOptions {
    fontSize?: string;
    lineHeight?: string;
    marginBottom?: string;
    className?: string;
    preWrap?: boolean;
}

export interface ButtonOptions {
    variant?: ButtonVariant;
    width?: string;
    className?: string;
}

export interface ButtonContainerOptions {
    gap?: string;
    justifyContent?: string;
    className?: string;
}

export interface ErrorOptions {
    buttonText?: string;
    onClose?: (() => void) | null;
    id?: string | null;
}

export interface WarningOptions {
    buttonText?: string;
    onClose?: (() => void) | null;
    id?: string | null;
}

export interface ConfirmOptions {
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onCancel?: (() => void) | null;
    id?: string | null;
}

export interface InfoOptions {
    buttonText?: string;
    onClose?: (() => void) | null;
    variant?: OverlayVariant;
    emoji?: string;
    id?: string | null;
}

export interface CustomOptions {
    variant?: OverlayVariant;
    id?: string | null;
    zIndex?: number;
    maxWidth?: string;
    padding?: string;
}

export interface ProgressOptions {
    subtitle?: string;
    variant?: OverlayVariant;
    showSkip?: boolean;
    maxWidth?: string;
}

export interface ProgressResult {
    overlay: HTMLElement;
    box: HTMLElement;
    bar: HTMLElement;
    status: HTMLElement;
    skip: HTMLElement | null;
    close: () => void;
    setProgress: (percent: number) => void;
    setStatus: (text: string) => void;
}
