/*
import { Injectable } from '@angular/core';
import { CognitoUser, CognitoUserPool, AuthenticationDetails } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  private userPool: CognitoUserPool;
  private identityPoolId = 'dein-identity-pool-id'; // Ersetze mit deinem Identity Pool ID
  private userPoolId = 'dein-user-pool-id'; // Ersetze mit deinem User Pool ID
  private clientId = 'dein-client-id'; // Ersetze mit deinem App Client ID

  constructor() {
    const poolData = {
      UserPoolId: this.userPoolId,
      ClientId: this.clientId
    };
    this.userPool = new CognitoUserPool(poolData);
  }

  register(username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userPool.signUp(username, password, [], null, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  login(username: string, password: string): Promise<any> {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    });

    const userData = {
      Username: username,
      Pool: this.userPool
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          // Temporäre Anmeldeinformationen abrufen
          AWS.config.region = 'deine-region'; // Ersetze mit deiner Region
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: this.identityPoolId,
            Logins: {
              [`cognito-idp.deine-region.amazonaws.com/${this.userPoolId}`]: result.getIdToken().getJwtToken()
            }
          });
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        }
      });
    });
  }

  uploadFile(file: File): Promise<any> {
    const s3 = new AWS.S3();
    const params = {
      Bucket: 'dein-bucket-name', // Ersetze mit deinem Bucket-Namen
      Key: file.name,
      Body: file
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
*/
