import { Post } from './postmodel';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({ providedIn: 'root' })


export class Postservice {
    private posts: Post[] = [];
    private UpdatedPost = new Subject<Post[]>();
    constructor(private http: HttpClient, private router: Router) {
    }

    getpost() {
        this.http.get<any>('http://localhost:3000/posts')
            .pipe(map((postData) => {
                return postData.map(post => {
                    return {
                        title: post.title,
                        body: post.body,
                        id: post._id, 
                        imagePath: post.imagePath
                    };
                });
            }))
            .subscribe((transfotmrdpostes) => {
                this.posts = transfotmrdpostes;
                this.UpdatedPost.next([...this.posts]);
            });
    }

    postUpdatelistener() {
        return this.UpdatedPost.asObservable();
    }

    gesingle(id: string) {
        return this.http.get<{ _id: string, body: string, title: string,imagePath: string }>('http://localhost:3000/singlepost/' + id);
    }

    addpost(title: string, body: string, image: File) {
        const postdata = new FormData();
        postdata.append('title', title);
        postdata.append('body', body);
        postdata.append('image', image, title);
        this.http.post<{ post: Post }>('http://localhost:3000/posts', postdata).subscribe((response) => {
            console.log(response.post.id);
            const post: Post = { id: response.post.id, body: body, title: title, imagePath: response.post.imagePath }
            this.posts.push(post);
            this.UpdatedPost.next([...this.posts]);
            this.router.navigate(['/']);
        })

    }
    deletepost(postid: string) {
        this.http.delete('http://localhost:3000/posts/' + postid).subscribe(() => {
            const updatedpost = this.posts.filter(post => post.id !== postid);
            this.posts = updatedpost;
            this.UpdatedPost.next([...this.posts]);
        })
    }
    updatepost(id: string, title: string, body: string,image: File | string ) {
       let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("body", body);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        body: body,
        imagePath: image
      };
    }
        this.http.put('http://localhost:3000/posts/' + id, postData).subscribe(response => {
            const updatedposts = [...this.posts];
            const oldpostid = updatedposts.findIndex(p => {
                p.id === id;
            });
            const post: Post = {
                id: id,
                title: title,
                body: body,
                imagePath: ""
              };
            updatedposts[oldpostid] = post;
            this.posts = updatedposts;
            this.UpdatedPost.next([...this.posts]);
            this.router.navigate(['/']);
        })
    }

}