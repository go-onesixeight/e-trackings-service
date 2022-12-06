import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as firebase from 'firebase-admin';
import { ServiceAccount } from "firebase-admin";
// import * as serviceAccount as

const adminConfig = {
  // type: ServiceAccount.type,
  // projectId: serviceAccount.project_id,
  // privateKeyId: serviceAccount.private_key_id,
  // privateKey: serviceAccount.private_key,
  // clientEmail: serviceAccount.client_email,
  // clientId: serviceAccount.client_id,
  // authUri: serviceAccount.auth_uri,
  // tokenUri: serviceAccount.token_uri,
  // authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  // clientC509CertUrl: serviceAccount.client_x509_cert_url
};

@Injectable()
export class FirebaseService {
  private defaultApp: any;

  constructor() {
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(adminConfig),
      databaseURL: "https://fir-auth-bd895.firebaseio.com"
    });
  }

}
