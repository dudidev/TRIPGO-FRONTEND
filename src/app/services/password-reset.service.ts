import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ForgotPasswordRequest {
    correo_usuario: string;
}

export interface ResetPasswordRequest {
    token: string;
    nueva_password: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface ValidateTokenResponse {
    valid: boolean;
    message?: string;
}

export interface ResetPasswordResponse {
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class PasswordResetService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiBaseUrl}/auth`;

    forgotPassword(correo_usuario: string): Observable<ForgotPasswordResponse> {
        return this.http.post<ForgotPasswordResponse>(
            `${this.apiUrl}/forgot-password`,
            { correo_usuario }
        );
    }

    validateResetToken(token: string): Observable<ValidateTokenResponse> {
        return this.http.get<ValidateTokenResponse>(
            `${this.apiUrl}/validate-reset-token`,
            { params: { token } }
        );
    }

    resetPassword(token: string, nueva_password: string): Observable<ResetPasswordResponse> {
        return this.http.post<ResetPasswordResponse>(
            `${this.apiUrl}/reset-password`,
            { token, nueva_password }
        );
    }
}