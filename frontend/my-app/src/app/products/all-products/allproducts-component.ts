import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../productmodel';
import { Postservice } from '../product-service';
import { AuthService } from "../../auth/auth.servise";

import { Subscription } from 'rxjs';
@Component({
  selector: 'allproducts',
  templateUrl: './allproducts.html',
})
export class Allproductscomponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsub: Subscription;
  loading = false;
  userIsAuthenticated = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  Postservice: Postservice;
  constructor(Postservice: Postservice,private authService: AuthService) {
    this.Postservice = Postservice;
  }
  ngOnInit() {
    this.loading = true;
    this.Postservice.getpost();
    this.postsub = this.Postservice.postUpdatelistener()
      .subscribe((Post: Post[]) => {
        this.loading = false;
        this.posts = Post;
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
        });
  }
  onDelete(postid:string){
this.Postservice.deletepost(postid);
  }
  ngOnDestroy() {
    this.postsub.unsubscribe();
  }
}