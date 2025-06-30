import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account, Client, OAuthProvider, Databases } from 'appwrite';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private account: Account;
  private databases: Databases;

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  private isAuthCheckedSubject = new BehaviorSubject<boolean>(false);
  isAuthChecked$: Observable<boolean> = this.isAuthCheckedSubject.asObservable();

  private usernameSubject = new BehaviorSubject<string>("Guest");
  username$: Observable<string> = this.usernameSubject.asObservable();

  constructor(private message: NzMessageService) {
    const client = new Client();
    client
      .setEndpoint('https://fra.cloud.appwrite.io/v1')
      .setProject('669cbafc001a06e0c089')
      .setDevKey('8932225a10e45dfa462fd907ad5f2aa1ee7a620d34aa06bf49953138c82d6080aa6c3ffdf4f73e1bf5c798cb032321fc8b0c5917993f9959565ab438e3557d413e2263d81cf203e0cf4a1ed356db43366bae92193997f4cb6634019ff5e3098f4e1884fe38e585888b0304f1e567deb5c3c60cd557f247164f460bbd138aeb50');

    this.account = new Account(client);
    this.getUser();
    this.databases = new Databases(client);

  }

  getUser(): Promise<string> {
    return this.account.get()
      .then(user => {
        this.isLoggedInSubject.next(true);
        const username = user.name || 'Guest';
        this.usernameSubject.next(username);
        this.message.success('Welcome, ' + username);
        return username;
      })
      .catch(() => {
        this.isLoggedInSubject.next(false);
        const guestName = 'Guest';
        this.usernameSubject.next(guestName);
        this.message.error('Could not retrieve user information');
        return guestName;
      })
      .finally(() => {
        this.isAuthCheckedSubject.next(true);
      });
  }

  login(email: string, password: string): Promise<void> {
    return this.account.createEmailPasswordSession(email, password)
      .then(() => {
        this.isLoggedInSubject.next(true);
        this.message.success('Login successful');
      })
      .catch(error => {
        this.isLoggedInSubject.next(false);
        this.message.error('Login failed: ' + error.message);
        throw error;
      });
  }

  async loginWithGoogle(): Promise<void> {
    try {
      await this.account.createOAuth2Session(
        OAuthProvider.Google,
        'https://yeetco.shop/home',
        'https://yeetco.shop/home'
      );
    } catch (error: any) {
      this.isLoggedInSubject.next(false);
      this.message.error('Login with Google failed: ' + error.message);
      throw error;
    }
  }

  logout(): Promise<void> {
    return this.account.deleteSession('current')
      .then(() => {
        this.isLoggedInSubject.next(false);
        this.message.success('Logout successful');
      })
      .catch(() => {
        this.message.error('Logout failed');
      });
  }

  ListDocuments(databaseId: string, collectionId: string): Promise<any> {
    return this.databases.listDocuments(databaseId, collectionId)
      .then(response => {
        return response.documents;
      })
      .catch(error => {
        this.message.error('Failed to list documents: ' + error.message);
        throw error;
      });
  }
  GetDocument(databaseId: string, collectionId: string, documentId: string): Promise<any> {
    return this.databases.getDocument(databaseId, collectionId, documentId)
      .then(response => {
        return response;
      })
      .catch(error => {
        this.message.error('Failed to get document: ' + error.message + ' || ' + documentId);
        throw error;
      });
  }
  async CreateDocument(databaseId: string, collectionId: string, documentId: string, data: any): Promise<any> {
    try {
      const response = await this.databases.createDocument(databaseId, collectionId, documentId, data);
      return response;
    } catch (error: any) {
      this.message.error('Failed to create document: ' + error.message);
      throw error;
    }
  }
  createTruck(documentId: string, data: any): Promise<any> {
    return this.databases.createDocument('tst', 'trucks', documentId, data)
      .then(response => {
        return response;
      })
      .catch(error => {
        this.message.error('Failed to create document: ' + error.message);
        throw error;
      });
  }
  
}
