import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

/** Two-step login: first PIN, then password. */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  /** 'pin' → step 1 | 'password' → step 2 */
  step = signal<'pin' | 'password'>('pin');

  pinForm: FormGroup;
  passwordForm: FormGroup;

  /** Populated after successful PIN verification */
  verifiedUser = signal<string>('');
  /** Token held temporarily until password is confirmed */
  private pendingToken = '';

  errorMessage = signal<string>('');
  isLoading = signal(false);
  showPassword = signal(false);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.pinForm = this.fb.group({
      pin: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[0-9]*$')]]
    });
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  /** Step 1: verify PIN against mock JSON */
  onPinSubmit(): void {
    if (this.pinForm.invalid) return;
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.loginWithPin(this.pinForm.value.pin).subscribe({
      next: (response: { token: string; user: string }) => {
        this.pendingToken = response.token;
        this.verifiedUser.set(response.user);
        this.isLoading.set(false);
        this.step.set('password');
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'An error occurred. Please try again.');
        this.pinForm.get('pin')?.reset();
      }
    });
  }

  /** Step 2: accept any non-empty password (mock), save token, navigate */
  async onPasswordSubmit(): Promise<void> {
    if (this.passwordForm.invalid) return;
    this.isLoading.set(true);
    this.errorMessage.set('');
    await this.authService.saveToken(this.pendingToken);
    this.router.navigate(['/shell/housekeeping']);
  }

  /** Go back to PIN step */
  goBack(): void {
    this.step.set('pin');
    this.verifiedUser.set('');
    this.pendingToken = '';
    this.errorMessage.set('');
    this.passwordForm.reset();
  }

  /** Derive initials from user name, e.g. 'John Watson' → 'JW' */
  get initials(): string {
    return this.verifiedUser()
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}