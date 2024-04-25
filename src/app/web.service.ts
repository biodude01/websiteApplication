import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { lastValueFrom } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({  providedIn: 'root' })


@Injectable()
export class WebService {

    shoppingLists: any; 
    searchList: any;
    requestResult: any;
    loginResponse: any;
    builtResponse: any;
    searchResult: any;
    listData: any;
    banResponse: any;
    accountResponse: any;
    productData: any;
    accountList: any;
    adminStatus: any;


constructor(private http: HttpClient) {}

searchQuery(body: any): Observable<any> { //retrieves search results from database on select products
       this.searchList = this.http.post('http://127.0.0.1:5000/api/v1.0/product/searchQuery', body);
       return this.searchList;
    }


retrieveUserLists(body: any): Observable<any>{ //retrieves all of a user's lists 
    return (this.http.post('http://127.0.0.1:5000/api/v1.0/account/shoppingLists/', body))
}

async retrieveListData(body: any,link: any){ //retrieves individual list data
  let url =  ('http://127.0.0.1:5000/api/v1.0/account/shoppingLists/' + link)

  return lastValueFrom(this.http.post(url, body))

}


deleteList(body: any, listID: any){ //removes user list from the database
console.log(body)
let url =  ('http://127.0.0.1:5000/api/v1.0/account/shoppingLists/' + listID)
return lastValueFrom(this.http.delete(url, body))

}


addList(body: any){ //adds a new list with optional product
    console.log(body)
    let url =  ('http://127.0.0.1:5000/api/v1.0/account/shoppingLists/')
    return lastValueFrom(this.http.post(url, body))
    
    }


insertToList(body: any, listID: any){ //adds product to a list
        console.log(body)
        let url =  ('http://127.0.0.1:5000/api/v1.0/account/shoppingLists/' + listID)
        return lastValueFrom(this.http.post(url, body))
        
        }

updateUserList(formData: any,listID: any){
            console.log(formData, 'and', listID)
            let url = ('http://127.0.0.1:5000/api/v1.0/account/shoppingLists/' + listID)
            return this.http.put(url, formData).subscribe((response: any) => {
            this.searchList = response;
            console.log(response)
            return response
            
 })
            
}


adminCheck(body: any){ //checks roles of the user

    return this.http.get(
        'http://127.0.0.1:5000/api/v1.0/account/Admin', body
        ).subscribe((response: any) => {
            this.adminStatus = response;
            console.log(response)
            return response
            })
        }

productAnalysis(url: any): Observable<any>{

    return (this.http.get('http://127.0.0.1:5000/api/v1.0/product/searchQuery/productAnalyzer/' + url))
}




async login(body: any) { //Retrieves login detail confirmation, but needs a async delay for verification.

    return lastValueFrom(this.http.post(
        'http://127.0.0.1:5000/api/v1.0/account/login', body
        ))

}

register(body: any) { //registers new users on the database

    return this.http.post(
        'http://127.0.0.1:5000/api/v1.0/account/signup', body
        ).subscribe((response: any) => {
            this.requestResult = response;
            console.log(response)
            })

}

updateAccount(body: any,id: any) { //updates account details on the database

let url = 'http://127.0.0.1:5000/api/v1.0/account/' + id
    return this.http.put(url, body
        ).subscribe((response: any) => {
            this.requestResult = response;
            console.log(response)
            })

}

deleteAccount(body: any, data: any){ //permanently deletes user account from the  database
console.log(data)
    let url = ('http://127.0.0.1:5000/api/v1.0/account/' + data)
    return lastValueFrom(this.http.delete(url, body
        ))
    }

getAccountDetails(body: any){

   return lastValueFrom(this.http.post(
    'http://127.0.0.1:5000/api/v1.0/account', body
    ))

    
}


logout(body: any) { //logs out users, but specifically blacklist's a user's token from being used again
return lastValueFrom(this.http.post('http://127.0.0.1:5000/api/v1.0/account/logout', body))

}

adminBan(body: any){ //lets admins delete a user from the system and ban a user's email from ever being reused
   return this.http.get(
    'http://127.0.0.1:5000/api/v1.0/account/ban', body
   ).subscribe((response: any) => {
    this.banResponse = response;
    console.log(response)

   })

}


retrieveAllAccounts(body: any){ //retrieves all accounts on the system for admin.
    return this.http.get(
        'http://127.0.0.1:5000/api/v1.0/accounts', body
       ).subscribe((response: any) => {
        this.accountList = response;
        console.log(response)
    
})

}

 async retrieveAccount(body: any){ //retrieves data on a specific account.
    let url = ('http://127.0.0.1:5000/api/v1.0/account' + body['username'])
    return this.http.get(url
       ).subscribe((response: any) => {
        this.accountResponse = response;
        console.log(response); 
          
})
 }

}