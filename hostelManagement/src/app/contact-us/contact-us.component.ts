import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactUsService } from './contact-us.service';

@Component({
  selector: 'hostel-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  private apiUrl = 'http://localhost:4050/api/contactUs/';
  user: User;

  contactHistory: any = [];
  replyMsgList : any = [];
  totalReplyMsg : number = 0;

  contactFormGroup = new FormGroup({
    title : new FormControl('',[Validators.required]),
    query : new FormControl('',[Validators.required])
  });

  constructor(private authService: AuthService, private router: Router, private contactService: ContactUsService) 
  { 
    this.authService.findMe().subscribe(user =>(this.user = user));
    this.showHistory();

    this.contactService.replyMessageHistory().subscribe((contactReplyHistory) => { 
      this.replyMsgList = contactReplyHistory.filter((a: { username: string; }) => a.username == this.user.username);
      this.totalReplyMsg = this.replyMsgList.length;
    });
  }

  contactFormSubmit() {
    if (!this.contactFormGroup.valid) {
      alert('Please enter valid values!');
      return;
    }
  
    const contactForm = this.contactFormGroup.getRawValue();
    const formData = {
      title: contactForm.title,
      query: contactForm.query,
      username: this.user.username
    };
  
    const formspreeEndpoint = 'https://formspree.io/f/mblgprkk';
  
    fetch(formspreeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (response.ok) {
        alert('Query submitted successfully!');
        this.router.navigate(['/']);
      } else {
        alert('Submission failed. Please try again.');
      }
    })
    .catch(error => {
      console.error('Form submission error:', error);
      alert('An error occurred.');
    });
  }
  
  showHistory() {
    // console.log('showHistory');
    this.contactService.showHistory()
    .subscribe((contactHistory) => {
        this.contactHistory = contactHistory;
        this.contactHistory = this.contactHistory.filter((item: { username: string; }) => (item.username == this.user.username));
        // console.log(this.contactHistory);
      }
    );
  }

  ngOnInit(): void {
  }

}
