import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account, Client, OAuthProvider } from 'appwrite';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private account: Account;

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  private isAuthCheckedSubject = new BehaviorSubject<boolean>(false);
  isAuthChecked$: Observable<boolean> = this.isAuthCheckedSubject.asObservable();

  username = '';

  constructor(private message: NzMessageService) {
    const client = new Client();
    client
      .setEndpoint('https://fra.cloud.appwrite.io/v1')
      .setProject('669cbafc001a06e0c089')
      .setDevKey('8932225a10e45dfa462fd907ad5f2aa1ee7a620d34aa06bf49953138c82d6080aa6c3ffdf4f73e1bf5c798cb032321fc8b0c5917993f9959565ab438e3557d413e2263d81cf203e0cf4a1ed356db43366bae92193997f4cb6634019ff5e3098f4e1884fe38e585888b0304f1e567deb5c3c60cd557f247164f460bbd138aeb50');

    this.account = new Account(client);
    this.getUser();
  }

  getUser(): Promise<string> {
    return this.account.get()
      .then(user => {
        this.isLoggedInSubject.next(true);
        this.username = user.name || 'Guest';
        this.message.success('Welcome, ' + this.username);
        return this.username;
      })
      .catch(() => {
        this.isLoggedInSubject.next(false);
        this.username = 'Guest';
        this.message.error('Could not retrieve user information');
        return this.username;
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
        'https://yeetco.shop',
        'https://yeetco.shop'
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
}
