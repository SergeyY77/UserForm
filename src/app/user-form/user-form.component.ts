import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  standalone: false,
})
export class UserFormComponent implements OnInit {
  userId: number | null = null;
  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: this.fb.group({
        street: [''],
        suite: [''],
        city: [''],
        zipcode: [''],
      }),
      phone: [''],
      website: [''],
      company: this.fb.group({
        name: [''],
        catchPhrase: [''],
        bs: [''],
      }),
    });

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.userId = params['id'];
        this.userService.getUser(this.userId).subscribe((user) => {
          this.userForm.patchValue(user);
        });
      }
    });
  }

  onSubmit() {
    if (this.userForm?.valid) {
      const userData = this.userForm.value;
      if (this.userId) {
        this.userService.updateUser(this.userId, userData).subscribe({
          next: (updated) => {
            console.log('User updated!', updated);
            this.router.navigate(['/users']);
          },
          error: (err) => console.error('Error updating user:', err),
        });
      } else {
        this.http.post('http://localhost:4000/users', userData).subscribe({
          next: (response) => {
            console.log('User saved!', response);
            this.router.navigate(['/users']);
          },
          error: (error) => {
            console.error('Error saving user:', error);
          },
        });
      }
    }
  }

  onDelete() {
    if (!this.userId) return;
    if (!confirm('Удалить этого пользователя?')) return;

    this.userService.deleteUser(this.userId).subscribe({
      next: () => {
        console.log('User deleted');
        this.router.navigate(['/users']);
      },
      error: (err) => console.error('Error deleting user:', err),
    });
  }
}

// this.userService.updateUser(this.userId, userData).subscribe((user) => {
//   this.userForm.patchValue(user);
// });
