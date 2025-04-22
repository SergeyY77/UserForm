import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from '../services/user.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  standalone: false,
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  userId?: number;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.userId = +params['id'];
        this.userService.getUser(this.userId).subscribe((user) => {
          this.userForm.patchValue(user);
        });
      }
    });
  }

  onSubmit(): void {
    const user: User = this.userForm.value;
    if (this.userId) {
      this.userService
        .updateUser(this.userId, user)
        .subscribe(() => this.router.navigate(['/users']));
    } else {
      this.userService
        .createUser(user)
        .subscribe(() => this.router.navigate(['/users']));
    }
  }
}
